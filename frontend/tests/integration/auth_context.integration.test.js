import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthContext } from "../../src/auth_context.js";

function getStoreValue(store) {
    let current;
    const unsubscribe = store.subscribe((value) => {
        current = value;
    });
    unsubscribe();
    return current;
}

describe("frontend integration: auth context", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("hydrates existing session token from storage", async () => {
        localStorage.setItem("techweb.auth.token", "stored-token");

        const context = createAuthContext({ apiBaseUrl: "http://localhost:3000" });
        const token = await context.actions.hydrateSession();

        expect(token).toBe("stored-token");
        expect(getStoreValue(context.authStore)).toMatchObject({
            token: "stored-token",
            isAuthenticated: true,
            error: null
        });
    });

    it("executes login and updates session state", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => ({ token: "jwt-from-api" })
            })
        );

        const context = createAuthContext({ apiBaseUrl: "http://localhost:3000" });
        const session = await context.actions.login({ username: "alice", password: "secret" });

        expect(session?.token).toBe("jwt-from-api");
        expect(localStorage.getItem("techweb.auth.token")).toBe("jwt-from-api");
        expect(getStoreValue(context.authStore)).toMatchObject({
            token: "jwt-from-api",
            isAuthenticated: true,
            isLoading: false
        });
    });
});
