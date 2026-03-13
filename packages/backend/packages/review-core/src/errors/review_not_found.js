export default class ReviewNotFoundError extends Error {
    constructor(reviewId) {
        super(`Review not found: ${reviewId}`);
        this.name = "ReviewNotFoundError";
    }
}
