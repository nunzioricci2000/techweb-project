export default class UserAlreadyExistsError extends Error {
    /** @type {string} */
    #username;

    /**
     * @param {string} username
     */
    constructor(username) {
        super(`User with username "${username}" already exists`);
        this.name = "UserAlreadyExistsError";
        this.#username = username;
    }

    /**
     * @returns {string}
     */
    getUsername() {
        return this.#username;
    }
}