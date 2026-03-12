import Session from "./entities/session.js";
export { Session };

import AuthApi from "./interfaces/auth_api.js";
import SessionRepository from "./interfaces/session_repository.js";
import LoginPresenter from "./interfaces/login_presenter.js";
import SignupPresenter from "./interfaces/signup_presenter.js";
import LogoutPresenter from "./interfaces/logout_presenter.js";
import LoginInteractor from "./use_cases/login_interactor.js";
import SignupInteractor from "./use_cases/signup_interactor.js";
import LogoutInteractor from "./use_cases/logout_interactor.js";

export { AuthApi, SessionRepository, LoginPresenter, SignupPresenter, LogoutPresenter };

export class AuthCoreRegistry {
    #loginInteractor;
    #signupInteractor;
    #logoutInteractor;

    constructor({ loggerService, authApi, sessionRepository, loginPresenter, signupPresenter, logoutPresenter }) {
        this.#loginInteractor = new LoginInteractor(authApi, sessionRepository, loginPresenter, loggerService);
        this.#signupInteractor = new SignupInteractor(authApi, signupPresenter, loggerService);
        this.#logoutInteractor = new LogoutInteractor(sessionRepository, logoutPresenter, loggerService);
    }

    getLoginInteractor() {
        return this.#loginInteractor;
    }

    getSignupInteractor() {
        return this.#signupInteractor;
    }

    getLogoutInteractor() {
        return this.#logoutInteractor;
    }
}
