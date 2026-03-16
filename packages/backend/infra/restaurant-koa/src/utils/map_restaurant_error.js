export function mapRestaurantError(error) {
    if (error?.name === "MissingRequestParameterError") {
        return {
            status: 400,
            body: { error: error.message }
        };
    }

    if (error?.name === "RestaurantNotFoundError" || error?.name === "ReviewNotFoundError") {
        return {
            status: 404,
            body: { error: error.message }
        };
    }

    if (error?.name === "UnauthorizedError") {
        return {
            status: 403,
            body: { error: error.message }
        };
    }

    if (error?.name === "InvalidVoteValueError") {
        return {
            status: 400,
            body: { error: error.message }
        };
    }

    return {
        status: 500,
        body: { error: "Internal server error" }
    };
}
