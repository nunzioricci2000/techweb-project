import { LoggerService } from "@techweb-project/core";
import { UserRepository } from "@techweb-project/auth-core";
import { RestaurantRepository } from "@techweb-project/restaurant-core";
import { ReviewRepository } from "@techweb-project/review-core";

import { SequelizeUserRepository } from "./repositories/sequelize_user_repository.js";
import { SequelizeRestaurantRepository } from "./repositories/sequelize_restaurant_repository.js";
import { SequelizeReviewRepository } from "./repositories/sequelize_review_repository.js";
import { Sequelize } from 'sequelize';
import { initUserModel } from './models/user_model.js';
import { initRestaurantModel } from './models/restaurant_model.js';
import { initReviewModel } from './models/review_model.js';
import { initVoteModel } from './models/vote_model.js';

export class PersistenceRegistry {
    /** @type {LoggerService} */
    #loggerService;

    /** @type {Sequelize} */
    #sequelize;

    #sequelizeConfig;

    #syncOptions;

    /** @type {UserRepository} */
    #userRepository;

    /** @type {RestaurantRepository} */
    #restaurantRepository;

    /** @type {ReviewRepository} */
    #reviewRepository;

    constructor({ loggerService, sequelizeConfig, syncOptions }) {
        this.#loggerService = loggerService;
        this.#sequelizeConfig = sequelizeConfig || {
            dialect: 'sqlite',
            storage: './database.sqlite',
            logging: this.#db_logger.bind(this)
        };
        this.#syncOptions = syncOptions || { alter: true };
        this.#sequelize = new Sequelize(this.#sequelizeConfig);
        this.#userRepository = new SequelizeUserRepository(this.#loggerService);
        this.#restaurantRepository = new SequelizeRestaurantRepository(this.#loggerService);
        this.#reviewRepository = new SequelizeReviewRepository(this.#loggerService);
    }

    /**
     * Initializes the database connection and models.
     */
    async initialize() {
        try {
            await this.#sequelize.authenticate();
            this.#loggerService.info('Connection to the database has been established successfully.');
        } catch (error) {
            this.#loggerService.error('Unable to connect to the database:', error);
            throw error;
        }
        initUserModel(this.#sequelize);
        initRestaurantModel(this.#sequelize);
        initReviewModel(this.#sequelize);
        initVoteModel(this.#sequelize);
        await this.#sequelize.sync(this.#syncOptions);
    }

    /**
     * @returns {Sequelize}
     */
    getSequelize() {
        return this.#sequelize;
    }

    /**
     * @returns {UserRepository}
     */
    getUserRepository() {
        return this.#userRepository;
    }

    /**
     * @returns {RestaurantRepository}
     */
    getRestaurantRepository() {
        return this.#restaurantRepository;
    }

    /**
     * @returns {ReviewRepository}
     */
    getReviewRepository() {
        return this.#reviewRepository;
    }

    async close() {
        await this.#sequelize.close();
    }

    #db_logger(message) {
        this.#loggerService.debug(message);
    }
}