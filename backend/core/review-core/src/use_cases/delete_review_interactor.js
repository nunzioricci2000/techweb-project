import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import ReviewNotFoundError from "../errors/review_not_found.js";
import UnauthorizedError from "../errors/unauthorized.js";
import DeleteReviewPresenter from "../interfaces/delete_review_presenter.js";
import ReviewRepository from "../interfaces/review_repository.js";

export default class DeleteReviewInteractor {
    /** @type {ReviewRepository} */
    #reviewRepository;

    /** @type {DeleteReviewPresenter} */
    #deleteReviewPresenter;

    #loggerService;

    constructor(reviewRepository, deleteReviewPresenter, loggerService) {
        this.#reviewRepository = reviewRepository;
        this.#deleteReviewPresenter = deleteReviewPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("DeleteReview use case initialized");
    }

    async execute({ reviewId, requesterUsername }) {
        try {
            if (!reviewId) {
                throw new MissingRequestParameterError("reviewId");
            }
            if (!requesterUsername) {
                throw new UnauthorizedError();
            }

            const review = await this.#reviewRepository.getReviewById(reviewId);
            if (!review) {
                throw new ReviewNotFoundError(reviewId);
            }
            if (review.authorUsername !== requesterUsername) {
                throw new UnauthorizedError("Only the author can delete this review");
            }

            await this.#reviewRepository.deleteReview(reviewId);
            const result = { success: true };
            await this.#deleteReviewPresenter.present(result);
            return result;
        } catch (error) {
            this.#loggerService.error(`DeleteReview failed: ${error.message}`);
            await this.#deleteReviewPresenter.presentError(error);
            return null;
        }
    }
}
