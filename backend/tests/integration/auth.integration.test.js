import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthCoreRegistry } from "@techweb-project/auth-core";
import { PersistenceRegistry } from "@techweb-project/persistence";

function createLogger() {
    return {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    };
}

describe("backend integration", () => {
    let persistenceRegistry;

    afterEach(async () => {
        if (persistenceRegistry) {
            await persistenceRegistry.close();
            persistenceRegistry = null;
        }
    });

    it("persists user and authenticates through auth core interactors", async () => {
        const loggerService = createLogger();

        persistenceRegistry = new PersistenceRegistry({
            loggerService,
            sequelizeConfig: {
                dialect: "sqlite",
                storage: ":memory:"
            },
            syncOptions: { force: true }
        });
        await persistenceRegistry.initialize();

        const signupPresenter = { present: vi.fn(), presentError: vi.fn() };
        const loginPresenter = { present: vi.fn(), presentError: vi.fn() };

        const authRegistry = new AuthCoreRegistry({
            loggerService,
            userRepository: persistenceRegistry.getUserRepository(),
            hashService: {
                hashPassword: vi.fn(async (password) => `hash:${password}`),
                comparePassword: vi.fn(async (password, hash) => hash === `hash:${password}`)
            },
            tokenService: {
                generateToken: vi.fn(async (username) => `token:${username}`)
            },
            signupPresenter,
            loginPresenter
        });

        const createdUser = await authRegistry
            .getSignupInteractor()
            .execute({ username: "integration-user", password: "secret" });

        const authenticatedUser = await authRegistry
            .getLoginInteractor()
            .execute({ username: "integration-user", password: "secret" });

        expect(createdUser?.username).toBe("integration-user");
        expect(authenticatedUser?.username).toBe("integration-user");
        expect(loginPresenter.present).toHaveBeenCalledWith("token:integration-user");
    });
});
