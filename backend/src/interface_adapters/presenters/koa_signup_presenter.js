import MissingRequestParameterError from "../../core/use_cases/errors/missing_request_parameter.js";
import LoggerService from "../../core/use_cases/interfaces/logger_service.js";
import SignupPresenter from "../../core/use_cases/interfaces/signup_presenter.js";

export default class KoaSignupPresenter extends SignupPresenter {
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
        this.#loggerService.debug("KoaSignupPresenter initialized");
    }

    present(username) {
        this.#loggerService.debug(`Signup successful for user: ${username}`);
        this.ctx.status = 201;
        this.ctx.body = { username };
    }

    presentError(error) {
        this.#loggerService.error(`Signup error: ${error.message}`);
        if (error instanceof UserAlreadyExistsError) {
            this.ctx.status = 409;
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