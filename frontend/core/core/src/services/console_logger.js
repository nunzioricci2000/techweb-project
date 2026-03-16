import { LoggerService } from "../interfaces/logger_service.js";

export class ConsoleLoggerService extends LoggerService {
    info(message) {
        console.info(message);
    }

    warn(message) {
        console.warn(message);
    }

    error(message) {
        console.error(message);
    }

    debug(message) {
        console.debug(message);
    }
}
