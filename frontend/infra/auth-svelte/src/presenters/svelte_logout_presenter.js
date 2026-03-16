import { LogoutPresenter } from "@techweb-project/frontend-auth-core";

export class SvelteLogoutPresenter extends LogoutPresenter {
    #authStore;

    constructor(authStore) {
        super();
        this.#authStore = authStore;
    }

    async present() {
        this.#authStore.update((state) => ({
            ...state,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        }));
    }

    async presentError(error) {
        this.#authStore.update((state) => ({
            ...state,
            isLoading: false,
            error: error?.message || "Unknown error"
        }));
    }
}
