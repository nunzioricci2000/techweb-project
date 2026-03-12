import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import AuthApi from "../interfaces/auth_api.js";
import SignupPresenter from "../interfaces/signup_presenter.js";
import { LoggerService } from "@techweb-project/frontend-core";

export default class SignupInteractor {
    #authApi;
    #signupPresenter;
    #loggerService;

    constructor(authApi, signupPresenter, loggerService) {
        this.#authApi = authApi;
        this.#signupPresenter = signupPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("Frontend signup use case initialized");
    }

    async execute({ username, password }) {
        if (!username || !password) {
            const error = new MissingRequestParameterError("username and password");
            await this.#signupPresenter.presentError(error);
            return null;
        }

        try {
            const createdUsername = await this.#authApi.signup({ username, password });
            await this.#signupPresenter.present(createdUsername);
            return createdUsername;
        } catch (error) {
            this.#loggerService.error(`Signup failed for user: ${username}`);
            await this.#signupPresenter.presentError(error);
            return null;
        }
    }
}
