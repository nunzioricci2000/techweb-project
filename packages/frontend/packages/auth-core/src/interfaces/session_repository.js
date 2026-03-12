export default class SessionRepository {
    async saveToken(_) {
        throw new Error("SessionRepository.saveToken must be implemented");
    }

    async getToken() {
        throw new Error("SessionRepository.getToken must be implemented");
    }

    async clearToken() {
        throw new Error("SessionRepository.clearToken must be implemented");
    }
}
