import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "@koa/bodyparser";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { AuthCoreRegistry, HashService, TokenService, LoginPresenter, SignupPresenter } from "@techweb-project/auth-core";
import ConsoleLogger from "@techweb-project/console-logger";
import { PersistenceRegistry } from "@techweb-project/persistence";

const DEFAULT_PORT = 3000;
const DEFAULT_JWT_EXPIRES_IN = "1h";
const DEFAULT_JWT_SECRET = "dev-secret-change-me";

class Argon2HashService extends HashService {
	async hashPassword(password) {
		return argon2.hash(password);
	}

	async comparePassword(password, hash) {
		return argon2.verify(hash, password);
	}
}

class JwtTokenService extends TokenService {
	/** @type {string} */
	#secret;

	/** @type {string} */
	#expiresIn;

	/**
	 * @param {Object} params
	 * @param {string} params.secret
	 * @param {string} params.expiresIn
	 */
	constructor({ secret, expiresIn }) {
		super();
		this.#secret = secret;
		this.#expiresIn = expiresIn;
	}

	async generateToken(username) {
		return jwt.sign({ username }, this.#secret, { expiresIn: this.#expiresIn });
	}

	async validateToken(token) {
		try {
			const payload = jwt.verify(token, this.#secret);
			return typeof payload === "object" && payload !== null && "username" in payload
				? payload.username
				: null;
		} catch {
			return null;
		}
	}
}

class HttpLoginPresenter extends LoginPresenter {
	/** @type {{ status: number, body: Object }} */
	response = { status: 500, body: { error: "Unknown error" } };

	async present(token) {
		this.response = {
			status: 200,
			body: { token }
		};
	}

	async presentError(error) {
		this.response = mapAuthError(error);
	}
}

class HttpSignupPresenter extends SignupPresenter {
	/** @type {{ status: number, body: Object }} */
	response = { status: 500, body: { error: "Unknown error" } };

	async present(username) {
		this.response = {
			status: 201,
			body: { username }
		};
	}

	async presentError(error) {
		this.response = mapAuthError(error);
	}
}

/**
 * @param {Error} error
 * @returns {{ status: number, body: Object }}
 */
function mapAuthError(error) {
	if (error?.name === "MissingRequestParameterError") {
		return {
			status: 400,
			body: { error: error.message }
		};
	}

	if (error?.name === "InvalidCredentialsError") {
		return {
			status: 401,
			body: { error: error.message }
		};
	}

	if (error?.name === "UserAlreadyExistsError") {
		return {
			status: 409,
			body: { error: error.message }
		};
	}

	return {
		status: 500,
		body: { error: "Internal server error" }
	};
}

/**
 * @param {Object} params
 * @param {import('@techweb-project/auth-core').UserRepository} params.userRepository
 * @param {HashService} params.hashService
 * @param {TokenService} params.tokenService
 * @param {import('@techweb-project/core').LoggerService} params.loggerService
 */
function createAuthRegistry({ userRepository, hashService, tokenService, loggerService }) {
	const loginPresenter = new HttpLoginPresenter();
	const signupPresenter = new HttpSignupPresenter();

	const authRegistry = new AuthCoreRegistry({
		loggerService,
		userRepository,
		hashService,
		tokenService,
		loginPresenter,
		signupPresenter
	});

	return {
		authRegistry,
		loginPresenter,
		signupPresenter
	};
}

/**
 * @returns {Promise<import('http').Server>}
 */
export async function main() {
	const loggerService = new ConsoleLogger();

	const persistenceRegistry = new PersistenceRegistry({ loggerService });
	await persistenceRegistry.initialize();

	const userRepository = persistenceRegistry.getUserRepository();
	const hashService = new Argon2HashService();
	const tokenService = new JwtTokenService({
		secret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN
	});

	const app = new Koa();
	const router = new Router();

	app.use(bodyParser());

	router.post("/auth/signup", async (ctx) => {
		const { authRegistry, signupPresenter } = createAuthRegistry({
			userRepository,
			hashService,
			tokenService,
			loggerService
		});

		const signupInteractor = authRegistry.getSignupInteractor();

		try {
			await signupInteractor.execute({
				username: ctx.request.body?.username,
				password: ctx.request.body?.password
			});
		} catch (error) {
			await signupPresenter.presentError(error);
		}

		ctx.status = signupPresenter.response.status;
		ctx.body = signupPresenter.response.body;
	});

	router.post("/auth/login", async (ctx) => {
		const { authRegistry, loginPresenter } = createAuthRegistry({
			userRepository,
			hashService,
			tokenService,
			loggerService
		});

		const loginInteractor = authRegistry.getLoginInteractor();

		await loginInteractor.execute({
			username: ctx.request.body?.username,
			password: ctx.request.body?.password
		});

		ctx.status = loginPresenter.response.status;
		ctx.body = loginPresenter.response.body;
	});

	app.use(router.routes());
	app.use(router.allowedMethods());

	const port = Number(process.env.PORT) || DEFAULT_PORT;
	const server = app.listen(port, () => {
		loggerService.info(`Backend listening on port ${port}`);
	});

	return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
