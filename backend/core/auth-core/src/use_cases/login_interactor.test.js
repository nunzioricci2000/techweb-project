import { describe, it, expect, vi } from "vitest";
import LoginInteractor from "./login_interactor.js";

function createLogger() {
    return {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    };
}

describe("LoginInteractor", () => {
    it("returns authenticated user on valid credentials", async () => {
        const userRepository = {
            exists: vi.fn().mockResolvedValue(true),
            getPasswordHash: vi.fn().mockResolvedValue("hash:pwd")
        };
        const hashService = {
            comparePassword: vi.fn().mockResolvedValue(true)
        };
        const tokenService = {
            generateToken: vi.fn().mockResolvedValue("jwt-token")
        };
        const loginPresenter = {
            present: vi.fn(),
            presentError: vi.fn()
        };

        const interactor = new LoginInteractor(
            userRepository,
            hashService,
            tokenService,
            loginPresenter,
            createLogger()
        );

        const user = await interactor.execute({ username: "alice", password: "pwd" });

        expect(user?.username).toBe("alice");
        expect(loginPresenter.present).toHaveBeenCalledWith("jwt-token");
        expect(loginPresenter.presentError).not.toHaveBeenCalled();
    });

    it("returns null and presents error when payload is invalid", async () => {
        const loginPresenter = {
            present: vi.fn(),
            presentError: vi.fn()
        };

        const interactor = new LoginInteractor(
            { exists: vi.fn(), getPasswordHash: vi.fn() },
            { comparePassword: vi.fn() },
            { generateToken: vi.fn() },
            loginPresenter,
            createLogger()
        );

        const user = await interactor.execute({ username: "", password: "" });

        expect(user).toBeNull();
        expect(loginPresenter.presentError).toHaveBeenCalledTimes(1);
    });
});
