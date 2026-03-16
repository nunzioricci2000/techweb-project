import { writable } from "svelte/store";

const INITIAL_STATE = {
    restaurants: [],
    currentRestaurant: null,
    reviews: [],
    page: 1,
    pageSize: 10,
    nameFilter: "",
    isLoading: false,
    error: null
};

export function createRestaurantStore() {
    const { subscribe, set, update } = writable({ ...INITIAL_STATE });

    return {
        subscribe,
        set,
        update,
        reset() {
            set({ ...INITIAL_STATE });
        },
        setLoading(isLoading) {
            update((state) => ({ ...state, isLoading }));
        },
        setError(error) {
            update((state) => ({ ...state, error }));
        }
    };
}
