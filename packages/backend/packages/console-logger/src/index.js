import { LoggerService } from '@techweb-project/core';

export default class ConsoleLogger extends LoggerService {
    log(...args) {
        console.log(...args);
    }

    info(...args) {
        console.info(...args);
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