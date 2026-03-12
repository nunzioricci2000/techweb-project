import LoggerService from '@techweb-project/logger-service';

export default class ConsoleLogger extends LoggerService {
    log(...args) {
        console.log(...args);
    }

    error(...args) {
        console.error(...args);
    }

    warn(...args) {
        console.warn(...args);
    }

    debug(...args) {
        console.debug(...args);
    }
}