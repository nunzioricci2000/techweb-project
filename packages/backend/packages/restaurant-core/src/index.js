import Restaurant from "./entities/restaurant.js";
import Geolocation from "./entities/data_objects/geolocation.js";
import Image from "./entities/data_objects/image.js";
import RestaurantRepository from "./interfaces/restaurant_repository.js";
import GetRestaurantsPresenter from "./interfaces/get_restaurants_presenter.js";
import GetRestaurantPresenter from "./interfaces/get_restaurant_presenter.js";
import CreateRestaurantPresenter from "./interfaces/create_restaurant_presenter.js";
import UpdateRestaurantPresenter from "./interfaces/update_restaurant_presenter.js";
import DeleteRestaurantPresenter from "./interfaces/delete_restaurant_presenter.js";
import GetRestaurantsInteractor from "./use_cases/get_restaurants_interactor.js";
import GetRestaurantByIdInteractor from "./use_cases/get_restaurant_by_id_interactor.js";
import CreateRestaurantInteractor from "./use_cases/create_restaurant_interactor.js";
import UpdateRestaurantInteractor from "./use_cases/update_restaurant_interactor.js";
import DeleteRestaurantInteractor from "./use_cases/delete_restaurant_interactor.js";

export { Restaurant, Geolocation, Image, RestaurantRepository, GetRestaurantsPresenter, GetRestaurantPresenter, CreateRestaurantPresenter, UpdateRestaurantPresenter, DeleteRestaurantPresenter };

export class RestaurantCoreRegistry {
    #getRestaurantsInteractor;
    #getRestaurantByIdInteractor;
    #createRestaurantInteractor;
    #updateRestaurantInteractor;
    #deleteRestaurantInteractor;

    constructor({ loggerService, restaurantRepository, getRestaurantsPresenter, getRestaurantPresenter, createRestaurantPresenter, updateRestaurantPresenter, deleteRestaurantPresenter }) {
        this.#getRestaurantsInteractor = new GetRestaurantsInteractor(restaurantRepository, getRestaurantsPresenter, loggerService);
        this.#getRestaurantByIdInteractor = new GetRestaurantByIdInteractor(restaurantRepository, getRestaurantPresenter, loggerService);
        this.#createRestaurantInteractor = new CreateRestaurantInteractor(restaurantRepository, createRestaurantPresenter, loggerService);
        this.#updateRestaurantInteractor = new UpdateRestaurantInteractor(restaurantRepository, updateRestaurantPresenter, loggerService);
        this.#deleteRestaurantInteractor = new DeleteRestaurantInteractor(restaurantRepository, deleteRestaurantPresenter, loggerService);
    }

    getGetRestaurantsInteractor() {
        return this.#getRestaurantsInteractor;
    }

    getGetRestaurantByIdInteractor() {
        return this.#getRestaurantByIdInteractor;
    }

    getCreateRestaurantInteractor() {
        return this.#createRestaurantInteractor;
    }

    getUpdateRestaurantInteractor() {
        return this.#updateRestaurantInteractor;
    }

    getDeleteRestaurantInteractor() {
        return this.#deleteRestaurantInteractor;
    }
}
