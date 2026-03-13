import InvalidVoteValueError from "../errors/invalid_vote_value.js";
import MissingRequestParameterError from "../errors/missing_request_parameter.js";
import CastVotePresenter from "../interfaces/cast_vote_presenter.js";
import ReviewRepository from "../interfaces/review_repository.js";

export default class CastVoteInteractor {
    /** @type {ReviewRepository} */
    #reviewRepository;

    /** @type {CastVotePresenter} */
    #castVotePresenter;

    #loggerService;

    constructor(reviewRepository, castVotePresenter, loggerService) {
        this.#reviewRepository = reviewRepository;
        this.#castVotePresenter = castVotePresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("CastVote use case initialized");
    }

    async execute({ reviewId, authorUsername, value }) {
        try {
            if (!reviewId) {
                throw new MissingRequestParameterError("reviewId");
            }
            if (!authorUsername) {
                throw new MissingRequestParameterError("authorUsername");
            }
            if (value == null) {
                throw new MissingRequestParameterError("value");
            }
            if (![1, -1].includes(Number(value))) {
                throw new InvalidVoteValueError(value);
            }

            const vote = await this.#reviewRepository.castVote({
                reviewId,
                authorUsername,
                value: Number(value)
            });
            await this.#castVotePresenter.present(vote);
            return vote;
        } catch (error) {
            this.#loggerService.error(`CastVote failed: ${error.message}`);
            await this.#castVotePresenter.presentError(error);
            return null;
        }
    }
}
