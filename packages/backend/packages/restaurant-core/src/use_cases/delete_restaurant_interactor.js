import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import RestaurantNotFoundError from "../errors/restaurant_not_found.js";
import UnauthorizedError from "../errors/unauthorized.js";
import DeleteRestaurantPresenter from "../interfaces/delete_restaurant_presenter.js";
import RestaurantRepository from "../interfaces/restaurant_repository.js";

export default class DeleteRestaurantInteractor {
    /** @type {RestaurantRepository} */
    #restaurantRepository;

    /** @type {DeleteRestaurantPresenter} */
    #deleteRestaurantPresenter;

    #loggerService;

    constructor(restaurantRepository, deleteRestaurantPresenter, loggerService) {
        this.#restaurantRepository = restaurantRepository;
        this.#deleteRestaurantPresenter = deleteRestaurantPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("DeleteRestaurant use case initialized");
    }

    async execute({ restaurantId, requesterUsername }) {
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
                throw new UnauthorizedError("Only the owner can delete this restaurant");
            }

            await this.#restaurantRepository.deleteRestaurant(restaurantId);
            const result = { success: true };
            await this.#deleteRestaurantPresenter.present(result);
            return result;
        } catch (error) {
            this.#loggerService.error(`DeleteRestaurant failed: ${error.message}`);
            await this.#deleteRestaurantPresenter.presentError(error);
            return null;
        }
    }
}
