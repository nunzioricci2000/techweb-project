import jwt from "jsonwebtoken";

import { TokenService } from "@techweb-project/auth-core";

/**
 * JWT-based implementation of the TokenService.
 */
export default class JwtTokenService extends TokenService {
    /** @type {string} */
    #secret;

    /** @type {string} */
    #expiresIn;

    /**
     * @param {Object} params
     * @param {string} params.secret
     * @param {string} params.expiresIn
     */
    constructor({ secret, expiresIn }) {
        super();
        this.#secret = secret;
        this.#expiresIn = expiresIn;
    }

    async generateToken(username) {
        return jwt.sign({ username }, this.#secret, { expiresIn: this.#expiresIn });
    }

    async validateToken(token) {
        try {
            const payload = jwt.verify(token, this.#secret);
            return typeof payload === "object" && payload !== null && "username" in payload
                ? payload.username
                : null;
        } catch {
            return null;
        }
    }
}
