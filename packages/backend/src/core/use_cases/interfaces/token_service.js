export default class TokenService {
    /**
     * Generates a new token.
     * @param {string} username The username for which to generate the token.
     * @returns {Promise<string>} The generated token.
     */
    async generateToken(username) {
        throw new Error("Method not implemented");
    }

    /**
     * Validates a token.
     * @param {string} token The token to validate.
     * @returns {Promise<string|null>} The username associated with the token if valid, null otherwise.
     */
    async validateToken(token) {
        throw new Error("Method not implemented");
    }
}