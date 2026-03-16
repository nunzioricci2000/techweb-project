import { SignupPresenter } from "@techweb-project/auth-core";
import { mapAuthError } from "../utils/map_auth_error.js";

export class HttpSignupPresenter extends SignupPresenter {
    /** @type {{ status: number, body: Object }} */
    response = { status: 500, body: { error: "Unknown error" } };

    async present(username) {
        this.response = {
            status: 201,
            body: { username }
        };
    }

    async presentError(error) {
        this.response = mapAuthError(error);
    }
}
