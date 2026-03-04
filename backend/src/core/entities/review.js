import User from "./user.js";
import Restaurant from "./restaurant.js";

export default class Review {
    /** @type {number} */
    id;

    /** @type {string} */
    content;

    /** @type {number} */
    rating;

    /** @type {User} */
    author;

    /** @type {Restaurant} */
    restaurant;

    /**
     * @param {number} id
     * @param {string} content
     * @param {number} rating
     * @param {User} author
     * @param {Restaurant} restaurant
     */
    constructor(id, content, rating, author, restaurant) {
        this.id = id;
        this.content = content;
        this.rating = rating;
        this.author = author;
        this.restaurant = restaurant;
    }
}