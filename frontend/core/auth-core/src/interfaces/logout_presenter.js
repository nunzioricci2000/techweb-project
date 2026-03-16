export default class LogoutPresenter {
    async present() {
        throw new Error("LogoutPresenter.present must be implemented");
    }

    async presentError(_) {
        throw new Error("LogoutPresenter.presentError must be implemented");
    }
}
