import App from "./App.svelte";
import { API_BASE_URL } from "./config.js";
import { createAuthContext } from "./auth_context.js";
import { createRestaurantContext } from "./restaurant_context.js";

async function bootstrap() {
    const { authStore, actions } = createAuthContext({ apiBaseUrl: API_BASE_URL });
    const { restaurantStore, restaurantActions } = createRestaurantContext({
        apiBaseUrl: API_BASE_URL,
        authStore
    });
    await actions.hydrateSession();

    return new App({
        target: document.getElementById("app"),
        props: {
            authStore,
            actions,
            restaurantStore,
            restaurantActions
        }
    });
}

const app = bootstrap();

export default app;
