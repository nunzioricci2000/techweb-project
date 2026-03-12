import { LoggerService } from "@techweb-backend/core";

import User from "../entities/user.js";
import InvalidCredentialsError from "./errors/invalid_credentials.js";
import MissingRequestParameterError from "./errors/missing_request_parameter.js";
import HashService from "./interfaces/hash_service.js";
import LoginPresenter from "./interfaces/login_presenter.js";
import TokenService from "./interfaces/token_service.js";
import UserRepository from "./interfaces/user_repository.js";

export default class LoginInteractor {
    /** @type {UserRepository} */
    #userRepository;

    /** @type {HashService} */
    #hashService;

    /** @type {TokenService} */
    #tokenService;

    /** @type {LoginPresenter} */
    #loginPresenter;

    /** @type {LoggerService} */
    #loggerService;

    /**
     * @param {UserRepository} userRepository
     * @param {HashService} hashService
     * @param {TokenService} tokenService
     * @param {LoginPresenter} loginPresenter
     * @param {LoggerService} loggerService
     */
    constructor(userRepository, hashService, tokenService, loginPresenter, loggerService) {
        this.#userRepository = userRepository;
        this.#hashService = hashService;
        this.#loginPresenter = loginPresenter;
        this.#tokenService = tokenService;
        this.#loggerService = loggerService;

        this.#loggerService.debug("Login use case initialized");
    }

    /**
     * Executes the login use case.
     * @param {Object} params
     * @param {string} params.username
     * @param {string} params.password
     * @returns {Promise<User?>} The authenticated user, or null if authentication failed.
     */
    async execute({ username, password }) {
        if (!username || !password) {
            this.#loggerService.warn("Login failed: missing username or password");
            this.#loginPresenter.presentError(new MissingRequestParameterError("username and password"));
            return null;
        }
        this.#loggerService.debug(`Attempting to log in user: ${username}`);
        try {
            if (!await this.#userRepository.exists(username)) {
                this.#loggerService.warn(`Login failed: user ${username} does not exist`);
                this.#loginPresenter.presentError(new InvalidCredentialsError(username));
                return null;
            }
            const storedHash = await this.#userRepository.getPasswordHash(username);
            const passwordMatches = await this.#hashService.comparePassword(password, storedHash);
            if (!passwordMatches) {
                this.#loggerService.warn(`Login failed: invalid password for user ${username}`);
                this.#loginPresenter.presentError(new InvalidCredentialsError(username));
                return null;
            }
            const token = await this.#tokenService.generateToken(username);
            await this.#loginPresenter.present(token);
            return new User(username);
        } catch (error) {
            this.#loggerService.error(`Login failed for user: ${username}`);
            await this.#loginPresenter.presentError(error);
            return null;
        }
    }
}