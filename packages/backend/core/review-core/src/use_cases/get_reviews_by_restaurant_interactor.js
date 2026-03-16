import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import GetReviewsPresenter from "../interfaces/get_reviews_presenter.js";
import ReviewRepository from "../interfaces/review_repository.js";

export default class GetReviewsByRestaurantInteractor {
    /** @type {ReviewRepository} */
    #reviewRepository;

    /** @type {GetReviewsPresenter} */
    #getReviewsPresenter;

    #loggerService;

    constructor(reviewRepository, getReviewsPresenter, loggerService) {
        this.#reviewRepository = reviewRepository;
        this.#getReviewsPresenter = getReviewsPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("GetReviewsByRestaurant use case initialized");
    }

    async execute({ restaurantId }) {
        try {
            if (!restaurantId) {
                throw new MissingRequestParameterError("restaurantId");
            }

            const reviews = await this.#reviewRepository.getReviewsByRestaurant(restaurantId);
            await this.#getReviewsPresenter.present(reviews);
            return reviews;
        } catch (error) {
            this.#loggerService.error(`GetReviewsByRestaurant failed: ${error.message}`);
            await this.#getReviewsPresenter.presentError(error);
            return null;
        }
    }
}
