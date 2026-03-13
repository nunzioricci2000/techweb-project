import { GetRestaurantPresenter } from "@techweb-project/restaurant-core";
import { mapRestaurantError } from "../utils/map_restaurant_error.js";

export class HttpGetRestaurantPresenter extends GetRestaurantPresenter {
    response = { status: 500, body: { error: "Unknown error" } };

    async present(restaurant) {
        this.response = { status: 200, body: { restaurant } };
    }

    async presentError(error) {
        this.response = mapRestaurantError(error);
    }
}
