export default class InvalidCredentialsError extends Error {
    /**
     * @param {string} username
     */
    constructor(username) {
        super(`Invalid credentials for user '${username}'`);
        this.name = "InvalidCredentialsError";
    }
}
