import TokenService from "./interfaces/token_service";
import UserRepository from "./interfaces/user_repository";
import ValidateAccessPresenter from "./interfaces/validate_access_presenter";

export default class ValidateAccess {
    /** @type {UserRepository} */
    #userRepository;

    /** @type {TokenService} */
    #tokenService;

    /** @type {ValidateAccessPresenter} */
    #validateAccessPresenter;

    /** @type {LoggerService} */
    #loggerService;

    /**
     * @param {UserRepository} userRepository
     * @param {TokenService} tokenService
     * @param {ValidateAccessPresenter} validateAccessPresenter
     * @param {LoggerService} loggerService
     */
    constructor(userRepository, tokenService, validateAccessPresenter, loggerService) {
        this.#userRepository = userRepository;
        this.#tokenService = tokenService;
        this.#validateAccessPresenter = validateAccessPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("ValidateAccess use case initialized");
    }

    /**
     * Executes the validate access use case.
     * @param {Object} params
     * @param {string} params.token
     * @returns {Promise<string>} The username associated with the token if valid, null otherwise.
     */
    async execute({ token }) {
        if (!token) {
            this.#loggerService.warn("Access validation failed: missing token");
            await this.#validateAccessPresenter.present(null);
            return null;
        }
        this.#loggerService.debug("Validating access with provided token");
        try {
            const username = await this.#tokenService.validateToken(token);
            if (await this.#userRepository.exists(username)) {
                this.#loggerService.debug(`Access granted for user: ${username}`);
                await this.#validateAccessPresenter.present(username);
                return username;
            } else {
                this.#loggerService.warn(`Access denied: user ${username} does not exist`);
                await this.#validateAccessPresenter.present(null);
                return null;
            }
        } catch (error) {
            this.#loggerService.error("Access validation failed", error);
            await this.#validateAccessPresenter.present(null);
            return null;
        }
    }
}