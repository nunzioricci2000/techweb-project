import App from "./App.svelte";
import { API_BASE_URL } from "./config.js";
import { createAuthContext } from "./auth_context.js";

async function bootstrap() {
    const { authStore, actions } = createAuthContext({ apiBaseUrl: API_BASE_URL });
    await actions.hydrateSession();

    return new App({
        target: document.getElementById("app"),
        props: {
            authStore,
            actions
        }
    });
}

const app = bootstrap();

export default app;
