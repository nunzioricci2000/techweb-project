export default class MissingRequestParameterError extends Error {
    constructor(parameterName) {
        super(`Missing required request parameter: ${parameterName}`);
        this.name = "MissingRequestParameterError";
    }
}
