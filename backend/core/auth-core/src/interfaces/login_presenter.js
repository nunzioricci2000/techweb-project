export default class LoginPresenter {
    /**
     * Presents the result of a login attempt.
     * @param {string} token The generated token if login was successful.
     */
    async present(token) {
        throw new Error("Method not implemented");
    }

    /**
     * Presents an error that occurred during login.
     * @param {Error} error The error that occurred.
     */
    async presentError(error) {
        throw new Error("Method not implemented");
    }
}