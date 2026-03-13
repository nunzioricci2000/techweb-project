import { HashService } from "@techweb-project/auth-core";
import argon2 from "argon2";

export default class Argon2HashService extends HashService {
    async hashPassword(password) {
        return await argon2.hash(password);
    }

    async comparePassword(password, hash) {
        return await argon2.verify(hash, password);
    }
}