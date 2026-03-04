export default class MissingRequestParameterError extends Error {
    /** @type {string} */
    #parameterName;

    /**
     * @param {string} parameterName
     */
    constructor(parameterName) {
        super(`Missing required request parameter: ${parameterName}`);
        this.name = "MissingRequestParameterError";
        this.#parameterName = parameterName;
    }

    /**
     * @returns {string}
     */
    getParameterName() {
        return this.#parameterName;
    }
}