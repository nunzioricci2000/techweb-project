import InvalidCredentialsError from "../../core/use_cases/errors/invalid_credentials.js";
import MissingRequestParameterError from "../../core/use_cases/errors/missing_request_parameter.js";
import LoginPresenter from "../../core/use_cases/interfaces/login_presenter.js";

export default class KoaLoginPresenter extends LoginPresenter {
    /** @type {LoggerService} */
    #loggerService;

    /**
     * @param {import("koa").Context} ctx
     * @param {LoggerService} loggerService
     */
    constructor(ctx, loggerService) {
        super();
        this.ctx = ctx;
        this.#loggerService = loggerService;
    }

    present(token) {
        this.#loggerService.debug(`Login successful for user: ${token}`);
        this.ctx.status = 200;
        this.ctx.body = { token };
    }

    presentError(error) {
        this.#loggerService.error(`Login error: ${error.message}`);
        if (error instanceof InvalidCredentialsError) {
            this.ctx.status = 401;
            this.ctx.body = { error: error.message };
        } else if (error instanceof MissingRequestParameterError) {
            this.ctx.status = 400;
            this.ctx.body = { error: error.message };
        } else {
            this.ctx.status = 500;
            this.ctx.body = { error: "An unexpected error occurred" };
        }
    }
}