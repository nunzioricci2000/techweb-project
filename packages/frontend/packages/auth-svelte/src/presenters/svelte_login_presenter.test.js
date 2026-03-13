import { describe, expect, it } from "vitest";
import { createAuthStore, INITIAL_AUTH_STATE } from "../auth_store.js";
import { SvelteLoginPresenter } from "./svelte_login_presenter.js";

function getStoreValue(store) {
    let value;
    const unsubscribe = store.subscribe((state) => {
        value = state;
    });
    unsubscribe();
    return value;
}

describe("SvelteLoginPresenter", () => {
    it("updates auth store on successful login", async () => {
        const authStore = createAuthStore();
        const presenter = new SvelteLoginPresenter(authStore);

        await presenter.present({ token: "jwt-token" });

        expect(getStoreValue(authStore)).toEqual({
            ...INITIAL_AUTH_STATE,
            token: "jwt-token",
            isAuthenticated: true,
            isLoading: false,
            error: null
        });
    });

    it("stores error message on login failure", async () => {
        const authStore = createAuthStore();
        const presenter = new SvelteLoginPresenter(authStore);

        await presenter.presentError(new Error("Boom"));

        expect(getStoreValue(authStore).error).toBe("Boom");
        expect(getStoreValue(authStore).isLoading).toBe(false);
    });
});
