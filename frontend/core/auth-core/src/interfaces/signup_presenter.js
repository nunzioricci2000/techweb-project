export default class SignupPresenter {
    async present(_) {
        throw new Error("SignupPresenter.present must be implemented");
    }

    async presentError(_) {
        throw new Error("SignupPresenter.presentError must be implemented");
    }
}
