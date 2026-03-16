import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { PersistenceRegistry } from "@techweb-project/persistence";
import { createBackendApp } from "../../src/index.js";

function createLogger() {
    return {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    };
}

describe("auth API", () => {
    let app;
    let persistenceRegistry;

    beforeEach(async () => {
        const loggerService = createLogger();

        persistenceRegistry = new PersistenceRegistry({
            loggerService,
            sequelizeConfig: {
                dialect: "sqlite",
                storage: ":memory:"
            },
            syncOptions: { force: true }
        });

        const built = await createBackendApp({
            loggerService,
            persistenceRegistry,
            hashService: {
                hashPassword: vi.fn(async (password) => `hash:${password}`),
                comparePassword: vi.fn(async (password, hash) => hash === `hash:${password}`)
            },
            tokenService: {
                generateToken: vi.fn(async (username) => `token:${username}`)
            }
        });

        app = built.app;
    });

    afterEach(async () => {
        if (persistenceRegistry) {
            await persistenceRegistry.close();
            persistenceRegistry = null;
        }
    });

    it("creates an account via POST /auth/signup", async () => {
        const response = await request(app.callback())
            .post("/auth/signup")
            .send({ username: "api-user", password: "secret" });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ username: "api-user" });
    });

    it("logs in via POST /auth/login after signup", async () => {
        await request(app.callback())
            .post("/auth/signup")
            .send({ username: "login-user", password: "secret" });

        const response = await request(app.callback())
            .post("/auth/login")
            .send({ username: "login-user", password: "secret" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ token: "token:login-user" });
    });
});
