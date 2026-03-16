import { SessionRepository } from "@techweb-project/frontend-auth-core";

const TOKEN_KEY = "techweb.auth.token";

export class BrowserSessionRepository extends SessionRepository {
    #storageService;

    constructor(storageService) {
        super();
        this.#storageService = storageService;
    }

    async saveToken(token) {
        this.#storageService.setItem(TOKEN_KEY, token);
    }

    async getToken() {
        return this.#storageService.getItem(TOKEN_KEY);
    }

    async clearToken() {
        this.#storageService.removeItem(TOKEN_KEY);
    }
}
