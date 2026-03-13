import { CreateReviewPresenter } from "@techweb-project/review-core";
import { mapRestaurantError } from "../utils/map_restaurant_error.js";

export class HttpCreateReviewPresenter extends CreateReviewPresenter {
    response = { status: 500, body: { error: "Unknown error" } };

    async present(review) {
        this.response = { status: 201, body: { review } };
    }

    async presentError(error) {
        this.response = mapRestaurantError(error);
    }
}
