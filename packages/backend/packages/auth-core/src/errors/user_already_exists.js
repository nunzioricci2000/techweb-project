export default class UserAlreadyExistsError extends Error {
    /**
     * @param {string} username
     */
    constructor(username) {
        super(`User '${username}' already exists`);
        this.name = "UserAlreadyExistsError";
    }
}
