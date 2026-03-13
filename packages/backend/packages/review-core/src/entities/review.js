export default class Review {
    /** @type {number} */
    id;

    /** @type {string} */
    content;

    /** @type {string} */
    authorUsername;

    /** @type {number} */
    restaurantId;

    /** @type {number} */
    upvotes;

    /** @type {number} */
    downvotes;

    /**
     * @param {number} id
     * @param {string} content
     * @param {string} authorUsername
     * @param {number} restaurantId
     * @param {number} [upvotes]
     * @param {number} [downvotes]
     */
    constructor(id, content, authorUsername, restaurantId, upvotes = 0, downvotes = 0) {
        this.id = id;
        this.content = content;
        this.authorUsername = authorUsername;
        this.restaurantId = restaurantId;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }
}