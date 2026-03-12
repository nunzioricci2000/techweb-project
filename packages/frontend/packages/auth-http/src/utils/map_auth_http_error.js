export function mapAuthHttpError({ status, body }) {
    const fallbackMessage = "Internal server error";
    const message = body?.error || fallbackMessage;

    return {
        name: "AuthHttpError",
        message,
        status
    };
}
