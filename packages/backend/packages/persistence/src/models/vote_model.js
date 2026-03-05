import { DataTypes, Model } from 'sequelize';

export default class VoteModel extends Model { }

export function initVoteModel(sequelize) {
    VoteModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, -1]]
            }
        },
        authorUsername: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'username'
            }
        },
        reviewId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'reviews',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Vote',
        tableName: 'votes',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['authorUsername', 'reviewId']
            }
        ]
    });
}
