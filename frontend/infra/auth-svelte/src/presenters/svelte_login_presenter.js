import { LoginPresenter } from "@techweb-project/frontend-auth-core";

export class SvelteLoginPresenter extends LoginPresenter {
    #authStore;

    constructor(authStore) {
        super();
        this.#authStore = authStore;
    }

    async present(session) {
        this.#authStore.update((state) => ({
            ...state,
            token: session.token,
            isAuthenticated: true,
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
