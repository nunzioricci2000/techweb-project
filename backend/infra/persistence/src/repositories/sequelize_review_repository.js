import { Review, ReviewRepository, Vote } from "@techweb-project/review-core";
import ReviewModel from "../models/review_model.js";
import VoteModel from "../models/vote_model.js";

export class SequelizeReviewRepository extends ReviewRepository {
    #loggerService;

    constructor(loggerService) {
        super();
        this.#loggerService = loggerService;
        this.#loggerService.debug("SequelizeReviewRepository initialized");
    }

    async getReviewsByRestaurant(restaurantId) {
        const reviews = await ReviewModel.findAll({
            where: { restaurantId: Number(restaurantId) },
            order: [["id", "DESC"]]
        });

        if (reviews.length === 0) {
            return [];
        }

        const reviewIds = reviews.map((review) => review.id);
        const votes = await VoteModel.findAll({ where: { reviewId: reviewIds } });

        return reviews.map((review) => {
            const reviewVotes = votes.filter((vote) => vote.reviewId === review.id);
            const upvotes = reviewVotes.filter((vote) => vote.value === 1).length;
            const downvotes = reviewVotes.filter((vote) => vote.value === -1).length;

            return new Review(
                review.id,
                review.content,
                review.authorUsername,
                review.restaurantId,
                upvotes,
                downvotes
            );
        });
    }

    async getReviewById(reviewId) {
        const review = await ReviewModel.findByPk(Number(reviewId));
        if (!review) {
            return null;
        }

        const votes = await VoteModel.findAll({ where: { reviewId: review.id } });
        const upvotes = votes.filter((vote) => vote.value === 1).length;
        const downvotes = votes.filter((vote) => vote.value === -1).length;

        return new Review(review.id, review.content, review.authorUsername, review.restaurantId, upvotes, downvotes);
    }

    async createReview({ content, authorUsername, restaurantId }) {
        const created = await ReviewModel.create({
            content,
            authorUsername,
            restaurantId: Number(restaurantId)
        });

        return new Review(created.id, created.content, created.authorUsername, created.restaurantId, 0, 0);
    }

    async deleteReview(reviewId) {
        await VoteModel.destroy({ where: { reviewId: Number(reviewId) } });
        await ReviewModel.destroy({ where: { id: Number(reviewId) } });
    }

    async castVote({ reviewId, authorUsername, value }) {
        const [vote, created] = await VoteModel.findOrCreate({
            where: { reviewId: Number(reviewId), authorUsername },
            defaults: {
                reviewId: Number(reviewId),
                authorUsername,
                value: Number(value)
            }
        });

        if (!created) {
            vote.value = Number(value);
            await vote.save();
        }

        return new Vote(vote.id, vote.value, vote.authorUsername, vote.reviewId);
    }
}
