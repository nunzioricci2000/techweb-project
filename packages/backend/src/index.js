import Koa from "koa";
import bodyParser from "@koa/bodyparser";

import ConsoleLogger from "@techweb-project/console-logger";
import { PersistenceRegistry } from "@techweb-project/persistence";
import Argon2HashService from "@techweb-project/argon2-hash";
import JwtTokenService from "@techweb-project/jwt-service";
import { createAuthRouter } from "@techweb-project/auth-koa";

const DEFAULT_PORT = 3000;
const DEFAULT_JWT_EXPIRES_IN = "1h";
const DEFAULT_JWT_SECRET = "dev-secret-change-me";

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
    app.use(bodyParser());

    const authRouter = createAuthRouter({ userRepository, hashService, tokenService, loggerService });
    app.use(authRouter.routes());
    app.use(authRouter.allowedMethods());

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
