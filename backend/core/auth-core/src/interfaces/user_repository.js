export default class UserRepository {
    /** 
     * @param {string} username
     * @param {string} passwordHash
     * @returns {Promise<string>} The created user's username.
     */
    async create(username, passwordHash) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {string} username
     * @returns {Promise<string>} password hash
     */
    async getPasswordHash(username) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {string} username
     * @returns {Promise<boolean>} True if the user exists, false otherwise.
     */
    async exists(username) {
        throw new Error("Method not implemented");
    }
}