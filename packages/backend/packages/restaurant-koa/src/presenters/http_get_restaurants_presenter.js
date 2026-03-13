import { GetRestaurantsPresenter } from "@techweb-project/restaurant-core";
import { mapRestaurantError } from "../utils/map_restaurant_error.js";

export class HttpGetRestaurantsPresenter extends GetRestaurantsPresenter {
    response = { status: 500, body: { error: "Unknown error" } };

    async present(restaurants) {
        this.response = { status: 200, body: { restaurants } };
    }

    async presentError(error) {
        this.response = mapRestaurantError(error);
    }
}
