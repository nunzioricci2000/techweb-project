import { AuthApi } from "@techweb-project/frontend-auth-core";
import { HttpClient } from "@techweb-project/frontend-core";
import { mapAuthHttpError } from "./utils/map_auth_http_error.js";

export class HttpAuthApi extends AuthApi {
    #httpClient;
    #baseUrl;

    constructor({ httpClient, baseUrl }) {
        super();
        this.#httpClient = httpClient;
        this.#baseUrl = baseUrl;
    }

    async signup({ username, password }) {
        const response = await this.#httpClient.post(`${this.#baseUrl}/auth/signup`, { username, password });
        if (!response.ok) {
            throw mapAuthHttpError(response);
        }

        return response.body?.username;
    }

    async login({ username, password }) {
        const response = await this.#httpClient.post(`${this.#baseUrl}/auth/login`, { username, password });
        if (!response.ok) {
            throw mapAuthHttpError(response);
        }

        return response.body?.token;
    }
}
