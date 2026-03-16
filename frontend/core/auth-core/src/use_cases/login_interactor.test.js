import { describe, expect, it, vi } from "vitest";
import LoginInteractor from "./login_interactor.js";

function createLogger() {
    return {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    };
}

describe("Frontend LoginInteractor", () => {
    it("stores session token and presents session on successful login", async () => {
        const authApi = { login: vi.fn().mockResolvedValue("jwt-token") };
        const sessionRepository = { saveToken: vi.fn(), clearToken: vi.fn(), getToken: vi.fn() };
        const loginPresenter = { present: vi.fn(), presentError: vi.fn() };

        const interactor = new LoginInteractor(authApi, sessionRepository, loginPresenter, createLogger());

        const session = await interactor.execute({ username: "alice", password: "secret" });

        expect(session?.token).toBe("jwt-token");
        expect(sessionRepository.saveToken).toHaveBeenCalledWith("jwt-token");
        expect(loginPresenter.present).toHaveBeenCalledWith(session);
    });

    it("returns null and presents validation error for missing credentials", async () => {
        const loginPresenter = { present: vi.fn(), presentError: vi.fn() };
        const interactor = new LoginInteractor(
            { login: vi.fn() },
            { saveToken: vi.fn(), clearToken: vi.fn(), getToken: vi.fn() },
            loginPresenter,
            createLogger()
        );

        const result = await interactor.execute({ username: "", password: "" });

        expect(result).toBeNull();
        expect(loginPresenter.presentError).toHaveBeenCalledTimes(1);
    });
});
