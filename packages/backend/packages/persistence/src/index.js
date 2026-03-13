import { LoggerService } from "@techweb-project/core";
import { UserRepository } from "@techweb-project/auth-core";

import { SequelizeUserRepository } from "./repositories/sequelize_user_repository.js";
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

    constructor({ loggerService, sequelizeConfig, syncOptions }) {
        this.#loggerService = loggerService;
        this.#sequelizeConfig = sequelizeConfig || {
            dialect: 'sqlite',
            storage: './database.sqlite'
        };
        this.#syncOptions = syncOptions || { alter: true };
        this.#sequelize = new Sequelize(this.#sequelizeConfig);
        this.#userRepository = new SequelizeUserRepository(this.#loggerService);
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

    async close() {
        await this.#sequelize.close();
    }
}