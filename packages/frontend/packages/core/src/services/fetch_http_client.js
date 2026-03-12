import { HttpClient } from "../interfaces/http_client.js";

export class FetchHttpClient extends HttpClient {
    #fetch;

    constructor(fetchImplementation) {
        super();
        this.#fetch = fetchImplementation;
    }

    async post(url, payload) {
        const response = await this.#fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        let body = null;
        try {
            body = await response.json();
        } catch {
            body = null;
        }

        return {
            ok: response.ok,
            status: response.status,
            body
        };
    }
}
