export default class MissingRequestParameterError extends Error {
    constructor(parameter) {
        super(`Missing required parameter: ${parameter}`);
        this.name = "MissingRequestParameterError";
    }
}
