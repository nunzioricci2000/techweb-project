import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import CreateReviewPresenter from "../interfaces/create_review_presenter.js";
import ReviewRepository from "../interfaces/review_repository.js";

export default class CreateReviewInteractor {
    /** @type {ReviewRepository} */
    #reviewRepository;

    /** @type {CreateReviewPresenter} */
    #createReviewPresenter;

    #loggerService;

    constructor(reviewRepository, createReviewPresenter, loggerService) {
        this.#reviewRepository = reviewRepository;
        this.#createReviewPresenter = createReviewPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("CreateReview use case initialized");
    }

    async execute({ content, authorUsername, restaurantId }) {
        try {
            if (!content) {
                throw new MissingRequestParameterError("content");
            }
            if (!authorUsername) {
                throw new MissingRequestParameterError("authorUsername");
            }
            if (!restaurantId) {
                throw new MissingRequestParameterError("restaurantId");
            }

            const review = await this.#reviewRepository.createReview({ content, authorUsername, restaurantId });
            await this.#createReviewPresenter.present(review);
            return review;
        } catch (error) {
            this.#loggerService.error(`CreateReview failed: ${error.message}`);
            await this.#createReviewPresenter.presentError(error);
            return null;
        }
    }
}
