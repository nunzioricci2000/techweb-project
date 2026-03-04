export default class InvalidCredentialsError extends Error {
    /** @type {string} */
    #username;

    /**
     * @param {string} username
     */
    constructor(username) {
        super(`Invalid credentials for username "${username}"`);
        this.name = "InvalidCredentialsError";
        this.#username = username;
    }

    /**
     * @returns {string}
     */
    getUsername() {
        return this.#username;
    }
}