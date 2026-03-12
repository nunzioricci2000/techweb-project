import { LoginPresenter } from "@techweb-project/auth-core";
import { mapAuthError } from "../utils/map_auth_error.js";

export class HttpLoginPresenter extends LoginPresenter {
    /** @type {{ status: number, body: Object }} */
    response = { status: 500, body: { error: "Unknown error" } };

    async present(token) {
        this.response = {
            status: 200,
            body: { token }
        };
    }

    async presentError(error) {
        this.response = mapAuthError(error);
    }
}
