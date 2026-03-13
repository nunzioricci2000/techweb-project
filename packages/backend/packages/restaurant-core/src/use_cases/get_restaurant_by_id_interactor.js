import RestaurantNotFoundError from "../errors/restaurant_not_found.js";
import GetRestaurantPresenter from "../interfaces/get_restaurant_presenter.js";
import RestaurantRepository from "../interfaces/restaurant_repository.js";

export default class GetRestaurantByIdInteractor {
    /** @type {RestaurantRepository} */
    #restaurantRepository;

    /** @type {GetRestaurantPresenter} */
    #getRestaurantPresenter;

    #loggerService;

    constructor(restaurantRepository, getRestaurantPresenter, loggerService) {
        this.#restaurantRepository = restaurantRepository;
        this.#getRestaurantPresenter = getRestaurantPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("GetRestaurantById use case initialized");
    }

    async execute({ restaurantId }) {
        try {
            const restaurant = await this.#restaurantRepository.getRestaurantById(restaurantId);
            if (!restaurant) {
                throw new RestaurantNotFoundError(restaurantId);
            }
            await this.#getRestaurantPresenter.present(restaurant);
            return restaurant;
        } catch (error) {
            this.#loggerService.error(`GetRestaurantById failed: ${error.message}`);
            await this.#getRestaurantPresenter.presentError(error);
            return null;
        }
    }
}
