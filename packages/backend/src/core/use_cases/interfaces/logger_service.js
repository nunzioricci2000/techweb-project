export default class LoggerService {
    log(...args) {
        throw new Error("Method 'log' must be implemented");
    }

    error(...args) {
        throw new Error("Method 'error' must be implemented");
    }

    warn(...args) {
        throw new Error("Method 'warn' must be implemented");
    }

    debug(...args) {
        throw new Error("Method 'debug' must be implemented");
    }
}