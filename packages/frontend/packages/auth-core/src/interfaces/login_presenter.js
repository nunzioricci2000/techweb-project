export default class LoginPresenter {
    async present(_) {
        throw new Error("LoginPresenter.present must be implemented");
    }

    async presentError(_) {
        throw new Error("LoginPresenter.presentError must be implemented");
    }
}
