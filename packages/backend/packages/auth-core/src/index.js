import User from "./entities/user.js";
export { User };

import HashService from "./interfaces/hash_service";
import UserRepository from "./interfaces/user_repository";
import TokenService from "./interfaces/token_service";
import LoginPresenter from "./interfaces/login_presenter";
import SignupPresenter from "./interfaces/signup_presenter";
import LoginInteractor from "./use_cases/login_interactor.js";
import SignupInteractor from "./use_cases/signup_interactor.js";
export { HashService, TokenService, UserRepository, LoginPresenter, SignupPresenter };

import { LoggerService } from "@techweb-project/core";

export class AuthCoreRegistry {
    /** @type {LoginInteractor} */
    #loginInteractor;
    /** @type {SignupInteractor} */
    #signupInteractor;

    /**
     * Initializes the authentication core registry with the necessary dependencies.
     * @param {Object} dependencies
     * @param {LoggerService} dependencies.loggerService
     * @param {UserRepository} dependencies.userRepository
     * @param {HashService} dependencies.hashService
     * @param {TokenService} dependencies.tokenService
     * @param {LoginPresenter} dependencies.loginPresenter
     * @param {SignupPresenter} dependencies.signupPresenter
     */
    constructor({ loggerService, userRepository, hashService, tokenService, loginPresenter, signupPresenter }) {
        this.#loginInteractor = new LoginInteractor(userRepository, hashService, tokenService, loginPresenter, loggerService);
        this.#signupInteractor = new SignupInteractor(userRepository, hashService, signupPresenter, loggerService);
    }

    /**
     * @returns {LoginInteractor}
     */
    getLoginInteractor() {
        return this.#loginInteractor;
    }

    /**
     * @returns {SignupInteractor}
     */
    getSignupInteractor() {
        return this.#signupInteractor;
    }
}