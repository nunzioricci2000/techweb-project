import { describe, expect, it, vi } from "vitest";
import { HttpAuthApi } from "./http_auth_api.js";

describe("HttpAuthApi", () => {
    it("returns username on successful signup", async () => {
        const httpClient = {
            post: vi.fn().mockResolvedValue({ ok: true, status: 201, body: { username: "new-user" } })
        };
        const api = new HttpAuthApi({ httpClient, baseUrl: "http://localhost:3000" });

        const username = await api.signup({ username: "new-user", password: "secret" });

        expect(username).toBe("new-user");
        expect(httpClient.post).toHaveBeenCalledWith("http://localhost:3000/auth/signup", {
            username: "new-user",
            password: "secret"
        });
    });

    it("throws mapped error on failed login", async () => {
        const httpClient = {
            post: vi.fn().mockResolvedValue({
                ok: false,
                status: 401,
                body: { error: "Invalid username or password" }
            })
        };
        const api = new HttpAuthApi({ httpClient, baseUrl: "http://localhost:3000" });

        await expect(api.login({ username: "a", password: "b" })).rejects.toMatchObject({
            name: "AuthHttpError",
            status: 401,
            message: "Invalid username or password"
        });
    });
});
