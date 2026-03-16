export default class SignupPresenter {
    /**
     * Presents the result of the sign-up use case.
     * @param {string} username The created user's username.
     */
    async present(username) {
        // This method should be implemented by the concrete presenter.
        throw new Error("Method not implemented.");
    }

    /**
     * Presents an error that occurred during the sign-up process.
     * @param {Error} error The error that occurred.
     */
    async presentError(error) {
        // This method should be implemented by the concrete presenter.
        throw new Error("Method not implemented.");
    }
}
