import { GetReviewsPresenter } from "@techweb-project/review-core";
import { mapRestaurantError } from "../utils/map_restaurant_error.js";

export class HttpGetReviewsPresenter extends GetReviewsPresenter {
    response = { status: 500, body: { error: "Unknown error" } };

    async present(reviews) {
        this.response = { status: 200, body: { reviews } };
    }

    async presentError(error) {
        this.response = mapRestaurantError(error);
    }
}
