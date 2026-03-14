const DEFAULT_CONFIG = {
    enabledLogTypes: ["info", "warn", "error", "debug", "log"],
    prefix: "",
};

export class ConsoleLogger {
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    info(...args) {
        this.#write("info", ...args);
    }

    warn(...args) {
        this.#write("warn", ...args);
    }

    error(...args) {
        this.#write("error", ...args);
    }

    debug(...args) {
        this.#write("debug", ...args);
    }

    log(...args) {
        this.#write("log", ...args);
    }

    #write(level, ...args) {
        if (!this.#isEnabled(level)) {
            return;
        }

        const consoleMethod = typeof console[level] === "function" ? level : "log";
        const outputArgs = this.config.prefix ? [this.config.prefix, ...args] : args;
        console[consoleMethod](...outputArgs);
    }

    #isEnabled(level) {
        const { enabledLogTypes } = this.config;
        if (!Array.isArray(enabledLogTypes)) {
            return true;
        }

        return enabledLogTypes.includes(level);
    }
}

export default ConsoleLogger;
