import jwt from "jsonwebtoken";

import { TokenService } from "@techweb-project/auth-core";
import LoggerService from "@techweb-project/logger";

/**
 * JWT-based implementation of the TokenService.
 */
export default class JwtTokenService extends TokenService {
    /** @type {string} */
    #secret;

    /** @type {string} */
    #expiresIn;

    /** @type {LoggerService | null} */
    #loggerService;

    /**
     * @param {Object} params
     * @param {string} params.secret
     * @param {string} params.expiresIn
     * @param {LoggerService} [params.loggerService]
     */
    constructor({ secret, expiresIn, loggerService = null }) {
        super();
        this.#secret = secret;
        this.#expiresIn = expiresIn;
        this.#loggerService = loggerService;

        this.#loggerService?.debug("JWT token service initialized");
    }

    async generateToken(username) {
        this.#loggerService?.debug(`Generating JWT token for user: ${username}`);
        return jwt.sign({ username }, this.#secret, { expiresIn: this.#expiresIn });
    }

    async validateToken(token) {
        try {
            const payload = jwt.verify(token, this.#secret);
            const username = typeof payload === "object" && payload !== null && "username" in payload
                ? payload.username
                : null;

            if (username) {
                this.#loggerService?.debug(`JWT token validated for user: ${username}`);
            } else {
                this.#loggerService?.warn("JWT token validated but missing username payload");
            }

            return username;
        } catch {
            this.#loggerService?.warn("Invalid JWT token received");
            return null;
        }
    }
}
