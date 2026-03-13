import GetRestaurantsPresenter from "../interfaces/get_restaurants_presenter.js";
import RestaurantRepository from "../interfaces/restaurant_repository.js";

export default class GetRestaurantsInteractor {
    /** @type {RestaurantRepository} */
    #restaurantRepository;

    /** @type {GetRestaurantsPresenter} */
    #getRestaurantsPresenter;

    #loggerService;

    constructor(restaurantRepository, getRestaurantsPresenter, loggerService) {
        this.#restaurantRepository = restaurantRepository;
        this.#getRestaurantsPresenter = getRestaurantsPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("GetRestaurants use case initialized");
    }

    async execute({ page = 1, pageSize = 10, nameFilter } = {}) {
        try {
            const restaurants = await this.#restaurantRepository.getAllRestaurants({ page, pageSize, nameFilter });
            await this.#getRestaurantsPresenter.present(restaurants);
            return restaurants;
        } catch (error) {
            this.#loggerService.error(`GetRestaurants failed: ${error.message}`);
            await this.#getRestaurantsPresenter.presentError(error);
            return null;
        }
    }
}
