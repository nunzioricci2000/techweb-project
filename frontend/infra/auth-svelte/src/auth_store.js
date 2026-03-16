import { writable } from "svelte/store";

export const INITIAL_AUTH_STATE = {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastSignupUsername: null
};

export function createAuthStore() {
    const { subscribe, set, update } = writable(INITIAL_AUTH_STATE);

    return {
        subscribe,
        set,
        update,
        reset: () => set(INITIAL_AUTH_STATE),
        setLoading: (isLoading) => update((state) => ({ ...state, isLoading })),
        setError: (error) => update((state) => ({ ...state, error }))
    };
}
