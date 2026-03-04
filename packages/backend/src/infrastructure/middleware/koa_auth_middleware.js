import TokenService from "../../core/use_cases/interfaces/token_service";

export default class KoaAuthMiddleware {
    /** @type {TokenService} */
    #tokenService;

    /**
     * @param {TokenService} tokenService
     */
    constructor(tokenService) {
        this.#tokenService = tokenService;
    }

    /**
     * @returns {import("koa").Middleware}
     */
    getMiddleware() {
        /**
         * Sets the user in the context state if a valid token is provided in the Authorization header.
         * @param {import("koa").Context} ctx
         * @param {import("koa").Next} next
         * @return {Promise<void>}
         */
        return async (ctx, next) => {
            const authHeader = ctx.headers["authorization"];
            if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.substring(7);
                const username = await this.#tokenService.validateToken(token);
                if (username) {
                    ctx.state.user = { username };
                }
            }
            await next();
        };
    }
}