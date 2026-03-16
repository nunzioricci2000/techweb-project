import { StorageService } from "../interfaces/storage_service.js";

export class LocalStorageService extends StorageService {
    #storage;

    constructor(storage) {
        super();
        this.#storage = storage;
    }

    setItem(key, value) {
        this.#storage.setItem(key, value);
    }

    getItem(key) {
        return this.#storage.getItem(key);
    }

    removeItem(key) {
        this.#storage.removeItem(key);
    }
}
