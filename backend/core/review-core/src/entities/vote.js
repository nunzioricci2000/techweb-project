export default class Vote {
    /** @type {number} */
    id;

    /** @type {number} */
    value;

    /** @type {string} */
    authorUsername;

    /** @type {number} */
    reviewId;

    constructor(id, value, authorUsername, reviewId) {
        this.id = id;
        this.value = value;
        this.authorUsername = authorUsername;
        this.reviewId = reviewId;
    }
}
