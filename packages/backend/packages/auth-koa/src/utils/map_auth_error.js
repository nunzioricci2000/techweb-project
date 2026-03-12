/**
 * Maps an auth-core domain error to an HTTP response shape.
 * @param {Error} error
 * @returns {{ status: number, body: Object }}
 */
export function mapAuthError(error) {
    if (error?.name === "MissingRequestParameterError") {
        return {
            status: 400,
            body: { error: error.message }
        };
    }

    if (error?.name === "InvalidCredentialsError") {
        return {
            status: 401,
            body: { error: error.message }
        };
    }

    if (error?.name === "UserAlreadyExistsError") {
        return {
            status: 409,
            body: { error: error.message }
        };
    }

    return {
        status: 500,
        body: { error: "Internal server error" }
    };
}
