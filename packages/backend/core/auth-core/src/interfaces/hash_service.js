export default class HashService {
    /**
     * Hashes a password.
     * @param {string} password
     * @returns {Promise<string>} The hashed password.
     */
    async hashPassword(password) {
        throw new Error("Method not implemented");
    }

    /**
     * Compares a password with a hash.
     * @param {string} password
     * @param {string} hash
     * @returns {Promise<boolean>} True if the password matches the hash, false otherwise.
     */
    async comparePassword(password, hash) {
        throw new Error("Method not implemented");
    }
}