import jwt from "jsonwebtoken";
import TokenService from "../../core/use_cases/interfaces/token_service.js";
import LoggerService from "../../core/use_cases/interfaces/logger_service.js";

export default class JwtTokenService extends TokenService {
    /** @type {LoggerService} */
    #loggerService;

    /** @type {string} */
    #secretKey;

    /** @type {string} */
    #expiresIn;

    /**
     * 
     * @param {string} secretKey - The secret key used to sign the JWT tokens.
     * @param {string} expiresIn - The expiration time for the tokens (e.g., "1h" for 1 hour).
     * @param {LoggerService} loggerService - The logger service for logging token operations.
     */
    constructor(secretKey, expiresIn, loggerService) {
        super();
        this.#secretKey = secretKey;
        this.#expiresIn = expiresIn;
        this.#loggerService = loggerService;
        this.#loggerService.debug("JwtTokenService initialized");
    }

    async generateToken(username) {
        this.#loggerService.debug("Generating JWT token");
        return jwt.sign({ username }, this.#secretKey, { expiresIn: this.#expiresIn });
    }

    async validateToken(token) {
        this.#loggerService.debug("Validating JWT token");
        try {
            const decoded = jwt.verify(token, this.#secretKey);
            return decoded.username;
        } catch (error) {
            this.#loggerService.debug("Failed to validate JWT token");
            return null;
        }
    }
}