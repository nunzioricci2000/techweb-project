import LoggerService from "../../core/use_cases/interfaces/logger_service.js";

export default class ConsoleLoggerService extends LoggerService {
    log(...args) {
        console.log("[LOG]", ...args);
    }

    error(...args) {
        console.error(`[${getCallerInfo()}] [ERROR]`, ...args);
    }

    warn(...args) {
        console.warn(`[${getCallerInfo()}] [WARN]`, ...args);
    }

    debug(...args) {
        console.debug(`[${getCallerInfo()}] [DEBUG]`, ...args);
    }
}

function getCallerInfo() {
    const err = new Error();
    const stackLines = err.stack.split("\n");
    // stackLines[0] = "Error", [1] = getCallerInfo, [2] = log/error/warn/debug, [3] = actual caller
    const callerLine = stackLines[3] || "";
    const match = callerLine.match(/\((.+?):(\d+):(\d+)\)/) || callerLine.match(/at (.+?):(\d+):(\d+)/);
    if (!match) return "unknown";
    return `${match[1]}:${match[2]}:${match[3]}`;
}