import { UserRepository } from "@techweb-project/auth-core";
import UserModel from "../models/user_model.js";

export class SequelizeUserRepository extends UserRepository {
    /** @type {LoggerService} */
    #loggerService;

    constructor(loggerService) {
        super();
        this.#loggerService = loggerService;
        this.#loggerService.debug("SequelizeUserRepository initialized");
    }

    async exists(username) {
        this.#loggerService.debug(`Checking if user exists: ${username}`);
        const user = await UserModel.findOne({ where: { username } });
        this.#loggerService.debug(`User ${username} exists: ${!!user}`);
        return !!user;
    }

    async create(username, passwordHash) {
        this.#loggerService.debug(`Creating user: ${username}`);
        const user = await UserModel.create({ username, passwordHash });
        this.#loggerService.debug(`User created: ${user.username}`);
        return user.username;
    }

    async getPasswordHash(username) {
        this.#loggerService.debug(`Retrieving password hash for user: ${username}`);
        const user = await UserModel.findOne({ where: { username } });
        this.#loggerService.debug(`Password hash for user ${username}: ${user?.passwordHash || "not found"}`);
        if (!user) throw new Error("User not found");
        return user.passwordHash;
    }
}
