import { CastVotePresenter } from "@techweb-project/review-core";
import { mapRestaurantError } from "../utils/map_restaurant_error.js";

export class HttpCastVotePresenter extends CastVotePresenter {
    response = { status: 500, body: { error: "Unknown error" } };

    async present(vote) {
        this.response = { status: 200, body: { vote } };
    }

    async presentError(error) {
        this.response = mapRestaurantError(error);
    }
}
