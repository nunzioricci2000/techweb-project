import LogoutPresenter from "../interfaces/logout_presenter.js";
import SessionRepository from "../interfaces/session_repository.js";
import { LoggerService } from "@techweb-project/frontend-core";

export default class LogoutInteractor {
    #sessionRepository;
    #logoutPresenter;
    #loggerService;

    constructor(sessionRepository, logoutPresenter, loggerService) {
        this.#sessionRepository = sessionRepository;
        this.#logoutPresenter = logoutPresenter;
        this.#loggerService = loggerService;
        this.#loggerService.debug("Frontend logout use case initialized");
    }

    async execute() {
        try {
            await this.#sessionRepository.clearToken();
            await this.#logoutPresenter.present();
            return true;
        } catch (error) {
            this.#loggerService.error("Logout failed");
            await this.#logoutPresenter.presentError(error);
            return false;
        }
    }
}
