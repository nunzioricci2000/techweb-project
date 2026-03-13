export default class InvalidVoteValueError extends Error {
    constructor(value) {
        super(`Invalid vote value: ${value}. Expected 1 or -1`);
        this.name = "InvalidVoteValueError";
    }
}
