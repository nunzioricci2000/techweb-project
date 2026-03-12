import { SignupPresenter } from "@techweb-project/frontend-auth-core";

export class SvelteSignupPresenter extends SignupPresenter {
    #authStore;

    constructor(authStore) {
        super();
        this.#authStore = authStore;
    }

    async present(username) {
        this.#authStore.update((state) => ({
            ...state,
            lastSignupUsername: username,
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
