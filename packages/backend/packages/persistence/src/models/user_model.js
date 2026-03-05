import { Model } from 'sequelize';

export default class UserModel extends Model { }

export function initUserModel(sequelize) {
    UserModel.init({
        username: {
            type: 'STRING',
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        passwordHash: {
            type: 'STRING',
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    });
}