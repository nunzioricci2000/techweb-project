import { describe, it, expect } from "vitest";
import { mapAuthError } from "./map_auth_error.js";

describe("mapAuthError", () => {
    it("maps known auth errors to status codes", () => {
        const missing = mapAuthError({ name: "MissingRequestParameterError", message: "missing" });
        const invalid = mapAuthError({ name: "InvalidCredentialsError", message: "invalid" });
        const exists = mapAuthError({ name: "UserAlreadyExistsError", message: "exists" });

        expect(missing.status).toBe(400);
        expect(invalid.status).toBe(401);
        expect(exists.status).toBe(409);
    });

    it("maps unknown errors to 500", () => {
        const result = mapAuthError(new Error("boom"));

        expect(result).toEqual({
            status: 500,
            body: { error: "Internal server error" }
        });
    });
});
