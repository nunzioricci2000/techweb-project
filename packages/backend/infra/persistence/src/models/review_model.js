import { DataTypes, Model } from 'sequelize';

export default class ReviewModel extends Model { }

export function initReviewModel(sequelize) {
    ReviewModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        authorUsername: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'username'
            }
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        timestamps: false
    });
}
