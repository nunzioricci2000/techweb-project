import Router from "@koa/router";
import { AuthCoreRegistry } from "@techweb-project/auth-core";
import { HttpLoginPresenter } from "./presenters/http_login_presenter.js";
import { HttpSignupPresenter } from "./presenters/http_signup_presenter.js";

/**
 * Creates and returns a Koa router with `/auth/signup` and `/auth/login` routes.
 *
 * @param {Object} params
 * @param {import('@techweb-project/auth-core').UserRepository} params.userRepository
 * @param {import('@techweb-project/auth-core').HashService} params.hashService
 * @param {import('@techweb-project/auth-core').TokenService} params.tokenService
 * @param {import('@techweb-project/logger').LoggerService} params.loggerService
 * @returns {import('@koa/router')}
 */
export function createAuthRouter({ userRepository, hashService, tokenService, loggerService }) {
    const router = new Router();

    router.post("/auth/signup", async (ctx) => {
        const signupPresenter = new HttpSignupPresenter();
        const authRegistry = new AuthCoreRegistry({
            loggerService,
            userRepository,
            hashService,
            tokenService,
            loginPresenter: new HttpLoginPresenter(),
            signupPresenter
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
        const loginPresenter = new HttpLoginPresenter();
        const authRegistry = new AuthCoreRegistry({
            loggerService,
            userRepository,
            hashService,
            tokenService,
            loginPresenter,
            signupPresenter: new HttpSignupPresenter()
        });

        const loginInteractor = authRegistry.getLoginInteractor();

        await loginInteractor.execute({
            username: ctx.request.body?.username,
            password: ctx.request.body?.password
        });

        ctx.status = loginPresenter.response.status;
        ctx.body = loginPresenter.response.body;
    });

    return router;
}
