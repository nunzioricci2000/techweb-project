export class HttpRestaurantApi {
    #fetch;
    #baseUrl;

    constructor({ fetchImplementation, baseUrl }) {
        this.#fetch = fetchImplementation;
        this.#baseUrl = baseUrl;
    }

    async getRestaurants({ page = 1, pageSize = 10, nameFilter = "" } = {}) {
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize)
        });
        if (nameFilter) {
            params.set("nameFilter", nameFilter);
        }

        const response = await this.#fetch(`${this.#baseUrl}/restaurants?${params.toString()}`);
        return this.#parseResponse(response);
    }

    async getRestaurantById(restaurantId) {
        const response = await this.#fetch(`${this.#baseUrl}/restaurants/${restaurantId}`);
        return this.#parseResponse(response);
    }

    async createRestaurant({ token, name, description, latitude, longitude, imageFile }) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description || "");
        formData.append("latitude", String(latitude));
        formData.append("longitude", String(longitude));
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const response = await this.#fetch(`${this.#baseUrl}/restaurants`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        return this.#parseResponse(response);
    }

    async getReviewsByRestaurant(restaurantId) {
        const response = await this.#fetch(`${this.#baseUrl}/restaurants/${restaurantId}/reviews`);
        return this.#parseResponse(response);
    }

    async createReview({ token, restaurantId, content }) {
        const response = await this.#fetch(`${this.#baseUrl}/restaurants/${restaurantId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        return this.#parseResponse(response);
    }

    async deleteReview({ token, reviewId }) {
        const response = await this.#fetch(`${this.#baseUrl}/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return this.#parseResponse(response);
    }

    async castVote({ token, reviewId, value }) {
        const response = await this.#fetch(`${this.#baseUrl}/reviews/${reviewId}/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ value })
        });

        return this.#parseResponse(response);
    }

    async deleteRestaurant({ token, restaurantId }) {
        const response = await this.#fetch(`${this.#baseUrl}/restaurants/${restaurantId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return this.#parseResponse(response);
    }

    async #parseResponse(response) {
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
