import { AuthCoreRegistry } from "@techweb-project/frontend-auth-core";
import { HttpAuthApi, BrowserSessionRepository } from "@techweb-project/frontend-auth-http";
import { createAuthStore, SvelteLoginPresenter, SvelteSignupPresenter, SvelteLogoutPresenter } from "@techweb-project/frontend-auth-svelte";
import { ConsoleLoggerService, FetchHttpClient, LocalStorageService } from "@techweb-project/frontend-core";

export function createAuthContext({ apiBaseUrl }) {
    const authStore = createAuthStore();

    const loggerService = new ConsoleLoggerService();
    const httpClient = new FetchHttpClient(window.fetch.bind(window));
    const storageService = new LocalStorageService(window.localStorage);

    const authApi = new HttpAuthApi({ httpClient, baseUrl: apiBaseUrl });
    const sessionRepository = new BrowserSessionRepository(storageService);

    const authRegistry = new AuthCoreRegistry({
        loggerService,
        authApi,
        sessionRepository,
        loginPresenter: new SvelteLoginPresenter(authStore),
        signupPresenter: new SvelteSignupPresenter(authStore),
        logoutPresenter: new SvelteLogoutPresenter(authStore)
    });

    const loginInteractor = authRegistry.getLoginInteractor();
    const signupInteractor = authRegistry.getSignupInteractor();
    const logoutInteractor = authRegistry.getLogoutInteractor();

    const actions = {
        async hydrateSession() {
            const token = await sessionRepository.getToken();
            if (!token) {
                return null;
            }

            authStore.update((state) => ({
                ...state,
                token,
                isAuthenticated: true,
                error: null
            }));

            return token;
        },
        async login({ username, password }) {
            authStore.setLoading(true);
            authStore.setError(null);
            return loginInteractor.execute({ username, password });
        },
        async signup({ username, password }) {
            authStore.setLoading(true);
            authStore.setError(null);
            return signupInteractor.execute({ username, password });
        },
        async logout() {
            authStore.setLoading(true);
            authStore.setError(null);
            return logoutInteractor.execute();
        }
    };

    return {
        authStore,
        actions
    };
}
