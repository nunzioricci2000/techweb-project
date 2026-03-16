import { DeleteRestaurantPresenter } from "@techweb-project/restaurant-core";
import { mapRestaurantError } from "../utils/map_restaurant_error.js";

export class HttpDeleteRestaurantPresenter extends DeleteRestaurantPresenter {
    response = { status: 500, body: { error: "Unknown error" } };

    async present(result) {
        this.response = { status: 200, body: result };
    }

    async presentError(error) {
        this.response = mapRestaurantError(error);
    }
}
