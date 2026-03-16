import { User } from "@techweb-project/auth-core";
import { Geolocation, Image, Restaurant, RestaurantRepository } from "@techweb-project/restaurant-core";
import { Op } from "sequelize";
import RestaurantModel from "../models/restaurant_model.js";

export class SequelizeRestaurantRepository extends RestaurantRepository {
    #loggerService;

    constructor(loggerService) {
        super();
        this.#loggerService = loggerService;
        this.#loggerService.debug("SequelizeRestaurantRepository initialized");
    }

    async getRestaurantById(restaurantId) {
        const restaurant = await RestaurantModel.findByPk(restaurantId);
        if (!restaurant) {
            return null;
        }

        return this.#mapToEntity(restaurant);
    }

    async getRestaurantImage(restaurantId) {
        const restaurant = await RestaurantModel.findByPk(restaurantId);
        if (!restaurant) {
            return null;
        }

        return new Image(restaurant.imageUrl);
    }

    async getAllRestaurants({ page = 1, pageSize = 10, nameFilter } = {}) {
        const where = {};
        if (nameFilter) {
            where.name = { [Op.like]: `%${nameFilter}%` };
        }

        const offset = Math.max(0, (Number(page) - 1) * Number(pageSize));
        const limit = Number(pageSize);

        const restaurants = await RestaurantModel.findAll({
            where,
            order: [["id", "DESC"]],
            offset,
            limit
        });

        return restaurants.map((restaurant) => this.#mapToEntity(restaurant));
    }

    async createRestaurant({ name, description, geolocation, image, ownerUsername }) {
        const created = await RestaurantModel.create({
            name,
            description: description || "",
            latitude: Number(geolocation.latitude),
            longitude: Number(geolocation.longitude),
            imageUrl: image?.url || null,
            ownerUsername
        });

        return this.#mapToEntity(created);
    }

    async updateRestaurant(restaurantId, updateData) {
        const restaurant = await RestaurantModel.findByPk(restaurantId);
        if (!restaurant) {
            return null;
        }

        if (updateData.name != null) {
            restaurant.name = updateData.name;
        }
        if (updateData.description != null) {
            restaurant.description = updateData.description;
        }
        if (updateData.geolocation?.latitude != null) {
            restaurant.latitude = Number(updateData.geolocation.latitude);
        }
        if (updateData.geolocation?.longitude != null) {
            restaurant.longitude = Number(updateData.geolocation.longitude);
        }
        if (updateData.image?.url != null) {
            restaurant.imageUrl = updateData.image.url;
        }

        await restaurant.save();
        return this.#mapToEntity(restaurant);
    }

    async deleteRestaurant(restaurantId) {
        await RestaurantModel.destroy({ where: { id: restaurantId } });
    }

    #mapToEntity(restaurant) {
        return new Restaurant(
            restaurant.id,
            restaurant.name,
            restaurant.description,
            new Geolocation(restaurant.latitude, restaurant.longitude),
            new Image(restaurant.imageUrl),
            new User(restaurant.ownerUsername)
        );
    }
}
