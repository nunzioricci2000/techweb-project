import Review from "./entities/review.js";
import Vote from "./entities/vote.js";
import ReviewRepository from "./interfaces/review_repository.js";
import GetReviewsPresenter from "./interfaces/get_reviews_presenter.js";
import CreateReviewPresenter from "./interfaces/create_review_presenter.js";
import DeleteReviewPresenter from "./interfaces/delete_review_presenter.js";
import CastVotePresenter from "./interfaces/cast_vote_presenter.js";
import GetReviewsByRestaurantInteractor from "./use_cases/get_reviews_by_restaurant_interactor.js";
import CreateReviewInteractor from "./use_cases/create_review_interactor.js";
import DeleteReviewInteractor from "./use_cases/delete_review_interactor.js";
import CastVoteInteractor from "./use_cases/cast_vote_interactor.js";

export { Review, Vote, ReviewRepository, GetReviewsPresenter, CreateReviewPresenter, DeleteReviewPresenter, CastVotePresenter };

export class ReviewCoreRegistry {
    #getReviewsByRestaurantInteractor;
    #createReviewInteractor;
    #deleteReviewInteractor;
    #castVoteInteractor;

    constructor({ loggerService, reviewRepository, getReviewsPresenter, createReviewPresenter, deleteReviewPresenter, castVotePresenter }) {
        this.#getReviewsByRestaurantInteractor = new GetReviewsByRestaurantInteractor(reviewRepository, getReviewsPresenter, loggerService);
        this.#createReviewInteractor = new CreateReviewInteractor(reviewRepository, createReviewPresenter, loggerService);
        this.#deleteReviewInteractor = new DeleteReviewInteractor(reviewRepository, deleteReviewPresenter, loggerService);
        this.#castVoteInteractor = new CastVoteInteractor(reviewRepository, castVotePresenter, loggerService);
    }

    getGetReviewsByRestaurantInteractor() {
        return this.#getReviewsByRestaurantInteractor;
    }

    getCreateReviewInteractor() {
        return this.#createReviewInteractor;
    }

    getDeleteReviewInteractor() {
        return this.#deleteReviewInteractor;
    }

    getCastVoteInteractor() {
        return this.#castVoteInteractor;
    }
}
