import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import Session from "../entities/session.js";
import AuthApi from "../interfaces/auth_api.js";
import SessionRepository from "../interfaces/session_repository.js";
import LoginPresenter from "../interfaces/login_presenter.js";
import { LoggerService } from "@techweb-project/frontend-core";

export default class LoginInteractor {
    #authApi;
    #sessionRepository;
    #loginPresenter;
    #loggerService;

    constructor(authApi, sessionRepository, loginPresenter, loggerService) {
        this.#authApi = authApi;
        this.#sessionRepository = sessionRepository;
        this.#loginPresenter = loginPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("Frontend login use case initialized");
    }

    async execute({ username, password }) {
        if (!username || !password) {
            const error = new MissingRequestParameterError("username and password");
            await this.#loginPresenter.presentError(error);
            return null;
        }

        try {
            const token = await this.#authApi.login({ username, password });
            await this.#sessionRepository.saveToken(token);
            const session = new Session(token);
            await this.#loginPresenter.present(session);
            return session;
        } catch (error) {
            this.#loggerService.error(`Login failed for user: ${username}`);
            await this.#loginPresenter.presentError(error);
            return null;
        }
    }
}
