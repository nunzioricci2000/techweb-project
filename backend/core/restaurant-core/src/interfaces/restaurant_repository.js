export default class RestaurantRepository {
    /**
     * @param {string} restaurantId
     * @returns {Promise<Restaurant>}
     */
    async getRestaurantById(restaurantId) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {string} restaurantId
     * @returns {Promise<Image>}
     */
    async getRestaurantImage(restaurantId) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {{page: number, pageSize: number, nameFilter?: string}} options
     * @returns {Promise<Restaurant[]>}
     */
    async getAllRestaurants(options) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {object} restaurantData
     * @param {string} restaurantData.name
     * @param {string} restaurantData.description
     * @param {Image} restaurantData.image
     * @param {User} restaurantData.owner
     * @param {Geolocation} restaurantData.geolocation
     * @returns {Promise<Restaurant>}
     */
    async createRestaurant(restaurantData) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {string} restaurantId
     * @param {object} updateData
     * @param {string} [updateData.name]
     * @param {string} [updateData.description]
     * @param {Image} [updateData.image]
     * @param {Geolocation} [updateData.geolocation]
     * @returns {Promise<Restaurant>}
     */
    async updateRestaurant(restaurantId, updateData) {
        throw new Error("Method not implemented");
    }

    /**
     * @param {string} restaurantId
     * @returns {Promise<void>}
     */
    async deleteRestaurant(restaurantId) {
        throw new Error("Method not implemented");
    }
}