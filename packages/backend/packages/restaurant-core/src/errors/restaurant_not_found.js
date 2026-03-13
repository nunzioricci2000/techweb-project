export default class RestaurantNotFoundError extends Error {
    constructor(restaurantId) {
        super(`Restaurant not found: ${restaurantId}`);
        this.name = "RestaurantNotFoundError";
    }
}
