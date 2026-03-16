import { DataTypes, Model } from 'sequelize';

export default class RestaurantModel extends Model { }

export function initRestaurantModel(sequelize) {
    RestaurantModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ownerUsername: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'username'
            }
        }
    }, {
        sequelize,
        modelName: 'Restaurant',
        tableName: 'restaurants',
        timestamps: false
    });
}
