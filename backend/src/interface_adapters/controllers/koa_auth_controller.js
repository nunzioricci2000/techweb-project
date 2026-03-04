import Login from "../../core/use_cases/login.js";
import Signup from "../../core/use_cases/signup.js";
import UserAlreadyExistsError from "../../core/use_cases/errors/user_already_exists.js";

export default class KoaAuthController {
    /** @type {LoggerService} */
    #loggerService;

    /**
     * @type {Login}
     */
    #loginInteractor;

    /**
     * @type {Signup}
     */
    #signupInteractor;

    /**
     * @param {Login} loginInteractor
     * @param {Signup} signupInteractor
     * @param {LoggerService} loggerService
     */
    constructor(loginInteractor, signupInteractor, loggerService) {
        this.#loginInteractor = loginInteractor;
        this.#signupInteractor = signupInteractor;
        this.#loggerService = loggerService;
        this.#loggerService.debug("KoaAuthController initialized");
    }

    /**
     * Handles user login requests.
     *
     * @param {import("koa").Context} ctx - The Koa context object.
     */
    async login(ctx) {
        this.#loggerService.debug("Processing login request");
        this.#loggerService.debug(`Request body: ${JSON.stringify(ctx.request.body)}`);
        await this.#loginInteractor.execute(ctx.request.body ?? {});
    }

    /**
     * Handles user sign-up requests.
     *
     * @param {import("koa").Context} ctx - The Koa context object.
     */
    async signup(ctx) {
        this.#loggerService.debug("Processing signup request");
        await this.#signupInteractor.execute(ctx.request.body ?? {});
    }
}