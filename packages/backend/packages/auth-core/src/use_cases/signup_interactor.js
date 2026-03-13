import { LoggerService } from "@techweb-project/core";

import User from "../entities/user.js";
import UserRepository from "../interfaces/user_repository.js";
import HashService from "../interfaces/hash_service.js";
import SignupPresenter from "../interfaces/signup_presenter.js";
import UserAlreadyExistsError from "../errors/user_already_exists.js";
import MissingRequestParameterError from "../errors/missing_request_parameter.js";

export default class SignupInteractor {
    /** @type {UserRepository} */
    #userRepository;

    /** @type {HashService} */
    #hashService;

    /** @type {SignupPresenter} */
    #signupPresenter;

    /** @type {LoggerService} */
    #loggerService;

    /**
     * Creates a new sign-up use case instance.
     * @param {UserRepository} userRepository 
     * @param {HashService} hashService
     * @param {SignupPresenter} signupPresenter
     * @param {LoggerService} loggerService
     */
    constructor(userRepository, hashService, signupPresenter, loggerService) {
        this.#userRepository = userRepository;
        this.#hashService = hashService;
        this.#signupPresenter = signupPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("Signup use case initialized");
    }

    /** 
     * Executes the sign-up use case.
     * @param {Object} params
     * @param {string} params.username
     * @param {string} params.password
     * @returns {Promise<User?>} The created user.
     */
    async execute({ username, password }) {
        if (!username || !password) {
            this.#loggerService.warn("Signup failed: missing username or password");
            throw new MissingRequestParameterError("username and password");
        }
        this.#loggerService.debug(`Attempting to sign up user: ${username}`);
        try {
            if (await this.#userRepository.exists(username)) {
                this.#loggerService.warn(`Signup failed: user ${username} already exists`);
                throw new UserAlreadyExistsError(username);
            }
            this.#loggerService.debug(`Hashing password for user: ${username}`);
            const passwordHash = await this.#hashService.hashPassword(password);
            this.#loggerService.debug(`Creating user: ${username}`);
            const createdUsername = await this.#userRepository.create(username, passwordHash);
            this.#loggerService.debug(`User created: ${createdUsername}`);
            await this.#signupPresenter.present(createdUsername);
            this.#loggerService.debug(`Signup successful for user: ${createdUsername}`);
            return new User(createdUsername);
        } catch (error) {
            this.#loggerService.error(`Signup failed for user: ${username}\nError: ${error.message}`);
            await this.#signupPresenter.presentError(error);
            return null;
        }
    }
}