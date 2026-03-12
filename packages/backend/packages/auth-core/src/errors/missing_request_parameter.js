export default class MissingRequestParameterError extends Error {
    /**
     * @param {string} parameterName
     */
    constructor(parameterName) {
        super(`Missing required request parameter: ${parameterName}`);
        this.name = "MissingRequestParameterError";
    }
}
