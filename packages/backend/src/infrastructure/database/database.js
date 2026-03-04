import { Sequelize } from 'sequelize';
import { initUserModel } from './models/user_model.js';
import { initRestaurantModel } from './models/restaurant_model.js';
import { initReviewModel } from './models/review_model.js';
import { initVoteModel } from './models/vote_model.js';
import LoggerService from '../../core/use_cases/interfaces/logger_service.js';

export async function initializeDatabase() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite'
    });
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    initUserModel(sequelize);
    initRestaurantModel(sequelize);
    initReviewModel(sequelize);
    initVoteModel(sequelize);
    await sequelize.sync({ alter: true });
    return sequelize;
}