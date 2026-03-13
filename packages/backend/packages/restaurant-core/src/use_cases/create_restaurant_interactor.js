import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import CreateRestaurantPresenter from "../interfaces/create_restaurant_presenter.js";
import RestaurantRepository from "../interfaces/restaurant_repository.js";

export default class CreateRestaurantInteractor {
    /** @type {RestaurantRepository} */
    #restaurantRepository;

    /** @type {CreateRestaurantPresenter} */
    #createRestaurantPresenter;

    #loggerService;

    constructor(restaurantRepository, createRestaurantPresenter, loggerService) {
        this.#restaurantRepository = restaurantRepository;
        this.#createRestaurantPresenter = createRestaurantPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("CreateRestaurant use case initialized");
    }

    async execute({ name, description, geolocation, image, ownerUsername }) {
        try {
            if (!name) {
                throw new MissingRequestParameterError("name");
            }
            if (!geolocation || geolocation.latitude == null || geolocation.longitude == null) {
                throw new MissingRequestParameterError("geolocation.latitude and geolocation.longitude");
            }
            if (!ownerUsername) {
                throw new MissingRequestParameterError("ownerUsername");
            }

            const restaurant = await this.#restaurantRepository.createRestaurant({
                name,
                description,
                geolocation,
                image,
                ownerUsername
            });

            await this.#createRestaurantPresenter.present(restaurant);
            return restaurant;
        } catch (error) {
            this.#loggerService.error(`CreateRestaurant failed: ${error.message}`);
            await this.#createRestaurantPresenter.presentError(error);
            return null;
        }
    }
}
