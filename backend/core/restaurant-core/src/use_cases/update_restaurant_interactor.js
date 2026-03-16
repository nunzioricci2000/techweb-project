import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import RestaurantNotFoundError from "../errors/restaurant_not_found.js";
import UnauthorizedError from "../errors/unauthorized.js";
import RestaurantRepository from "../interfaces/restaurant_repository.js";
import UpdateRestaurantPresenter from "../interfaces/update_restaurant_presenter.js";

export default class UpdateRestaurantInteractor {
    /** @type {RestaurantRepository} */
    #restaurantRepository;

    /** @type {UpdateRestaurantPresenter} */
    #updateRestaurantPresenter;

    #loggerService;

    constructor(restaurantRepository, updateRestaurantPresenter, loggerService) {
        this.#restaurantRepository = restaurantRepository;
        this.#updateRestaurantPresenter = updateRestaurantPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("UpdateRestaurant use case initialized");
    }

    async execute({ restaurantId, requesterUsername, name, description, geolocation, image }) {
        try {
            if (!restaurantId) {
                throw new MissingRequestParameterError("restaurantId");
            }
            if (!requesterUsername) {
                throw new UnauthorizedError();
            }

            const existingRestaurant = await this.#restaurantRepository.getRestaurantById(restaurantId);
            if (!existingRestaurant) {
                throw new RestaurantNotFoundError(restaurantId);
            }
            if (existingRestaurant.owner?.username !== requesterUsername) {
                throw new UnauthorizedError("Only the owner can update this restaurant");
            }

            const updatedRestaurant = await this.#restaurantRepository.updateRestaurant(restaurantId, {
                name,
                description,
                geolocation,
                image
            });

            await this.#updateRestaurantPresenter.present(updatedRestaurant);
            return updatedRestaurant;
        } catch (error) {
            this.#loggerService.error(`UpdateRestaurant failed: ${error.message}`);
            await this.#updateRestaurantPresenter.presentError(error);
            return null;
        }
    }
}
