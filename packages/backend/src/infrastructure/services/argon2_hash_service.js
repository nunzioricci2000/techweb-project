import HashService from "../../core/use_cases/interfaces/hash_service.js";
import * as argon2 from "argon2";
import LoggerService from "../../core/use_cases/interfaces/logger_service.js";

export default class Argon2HashService extends HashService {
    /** @type {LoggerService} */
    #loggerService;

    /**
     * 
     * @param {LoggerService} loggerService 
     */
    constructor(loggerService) {
        super();
        this.#loggerService = loggerService;
        this.#loggerService.debug("Argon2HashService initialized");
    }

    /** Hashes a password using the Argon2 algorithm.
     * @param {string} password - The plaintext password to hash.
     * @returns {Promise<string>} The hashed password.
     */
    async hashPassword(password) {
        this.#loggerService.debug("Hashing password using Argon2");
        return argon2.hash(password);
    }

    /**
     * Compares a plaintext password against a hashed password.
     * @param {string} password - The plaintext password to compare.
     * @param {string} hash - The hashed password to compare against.
     * @returns {Promise<boolean>} True if the password is valid, false otherwise.
     */
    async comparePassword(password, hash) {
        try {
            return await argon2.verify(hash, password);
        } catch (error) {
            this.#loggerService.debug("Failed to compare password");
            // If verification fails (e.g., due to an invalid hash), return false
            return false;
        }
    }
}