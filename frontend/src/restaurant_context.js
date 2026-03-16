import { HttpRestaurantApi } from "@techweb-project/frontend-restaurant-http";
import { createRestaurantStore } from "@techweb-project/frontend-restaurant-svelte";

function mapErrorMessage(response) {
    return response?.body?.error || "Request failed";
}

export function createRestaurantContext({ apiBaseUrl, authStore }) {
    const restaurantStore = createRestaurantStore();
    const restaurantApi = new HttpRestaurantApi({
        fetchImplementation: window.fetch.bind(window),
        baseUrl: apiBaseUrl
    });

    const actions = {
        async getRestaurants({ page = 1, pageSize = 10, nameFilter = "" } = {}) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const response = await restaurantApi.getRestaurants({ page, pageSize, nameFilter });
            restaurantStore.setLoading(false);

            if (!response.ok) {
                restaurantStore.setError(mapErrorMessage(response));
                return null;
            }

            const restaurants = response.body?.restaurants || [];
            restaurantStore.update((state) => ({ ...state, restaurants, page, pageSize, nameFilter }));
            return restaurants;
        },

        async getRestaurantById(restaurantId) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const [restaurantResponse, reviewsResponse] = await Promise.all([
                restaurantApi.getRestaurantById(restaurantId),
                restaurantApi.getReviewsByRestaurant(restaurantId)
            ]);
            restaurantStore.setLoading(false);

            if (!restaurantResponse.ok) {
                restaurantStore.setError(mapErrorMessage(restaurantResponse));
                return null;
            }

            if (!reviewsResponse.ok) {
                restaurantStore.setError(mapErrorMessage(reviewsResponse));
                return null;
            }

            const currentRestaurant = restaurantResponse.body?.restaurant || null;
            const reviews = reviewsResponse.body?.reviews || [];
            restaurantStore.update((state) => ({ ...state, currentRestaurant, reviews }));
            return currentRestaurant;
        },

        async createRestaurant({ name, description, latitude, longitude, imageFile }) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const token = $authStoreSnapshot().token;

            const response = await restaurantApi.createRestaurant({
                token,
                name,
                description,
                latitude,
                longitude,
                imageFile
            });
            restaurantStore.setLoading(false);

            if (!response.ok) {
                restaurantStore.setError(mapErrorMessage(response));
                return null;
            }

            return response.body?.restaurant || null;
        },

        async createReview({ restaurantId, content }) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const token = $authStoreSnapshot().token;
            const response = await restaurantApi.createReview({ token, restaurantId, content });
            restaurantStore.setLoading(false);

            if (!response.ok) {
                restaurantStore.setError(mapErrorMessage(response));
                return null;
            }

            await actions.getRestaurantById(restaurantId);
            return response.body?.review || null;
        },

        async deleteReview({ restaurantId, reviewId }) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const token = $authStoreSnapshot().token;
            const response = await restaurantApi.deleteReview({ token, reviewId });
            restaurantStore.setLoading(false);

            if (!response.ok) {
                restaurantStore.setError(mapErrorMessage(response));
                return null;
            }

            await actions.getRestaurantById(restaurantId);
            return true;
        },

        async castVote({ restaurantId, reviewId, value }) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const token = $authStoreSnapshot().token;
            const response = await restaurantApi.castVote({ token, reviewId, value });
            restaurantStore.setLoading(false);

            if (!response.ok) {
                restaurantStore.setError(mapErrorMessage(response));
                return null;
            }

            await actions.getRestaurantById(restaurantId);
            return response.body?.vote || null;
        },

        async deleteRestaurant({ restaurantId }) {
            restaurantStore.setLoading(true);
            restaurantStore.setError(null);
            const token = $authStoreSnapshot().token;
            const response = await restaurantApi.deleteRestaurant({ token, restaurantId });
            restaurantStore.setLoading(false);

            if (!response.ok) {
                restaurantStore.setError(mapErrorMessage(response));
                return null;
            }

            return true;
        }
    };

    function $authStoreSnapshot() {
        let snapshot;
        const unsubscribe = authStore.subscribe((value) => {
            snapshot = value;
        });
        unsubscribe();
        return snapshot;
    }

    return {
        restaurantStore,
        restaurantActions: actions
    };
}
