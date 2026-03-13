import { LoggerService } from '@techweb-project/core';

const DEFAULT_CONFIG = {
    format: '[{type}] {callerName} ({callerFile}:{line}:{column})',
    enabledLogTypes: ['log', 'info', 'warn', 'error', 'debug'],
};

export default class ConsoleLogger extends LoggerService {
    constructor(config = {}) {
        super();
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    log(...args) {
        this._write('log', ...args);
    }

    info(...args) {
        this._write('info', ...args);
    }

    error(...args) {
        this._write('error', ...args);
    }

    warn(...args) {
        this._write('warn', ...args);
    }

    debug(...args) {
        this._write('debug', ...args);
    }

    _write(level, ...args) {
        if (!this._isLevelEnabled(level)) {
            return;
        }

        const prefix = this._buildPrefix(level);
        const outputArgs = prefix ? [prefix, ...args] : args;

        const method = typeof console[level] === 'function' ? level : 'log';
        console[method](...outputArgs);
    }

    _isLevelEnabled(level) {
        const enabledLogTypes = this.config.enabledLogTypes;

        if (!Array.isArray(enabledLogTypes)) {
            return true;
        }

        return enabledLogTypes.includes(level);
    }

    _buildPrefix(level) {
        const format = this.config.format;
        if (!format) {
            return '';
        }

        const caller = this._resolveCaller();
        return format
            .replace('{type}', level)
            .replace('{callerName}', caller?.name ?? '')
            .replace('{callerFile}', caller?.file ?? '')
            .replace('{line}', caller?.line ?? '')
            .replace('{column}', caller?.column ?? '');
    }

    _resolveCaller() {
        const stack = new Error().stack;
        if (!stack) {
            return null;
        }

        const lines = stack.split('\n').slice(1).map((line) => line.trim());
        const callerLine = lines.find((line) => {
            if (!line.startsWith('at ')) {
                return false;
            }

            return !line.includes('ConsoleLogger.') &&
                !line.includes('at new ConsoleLogger') &&
                !line.includes('console-logger/src/index.js');
        });

        if (!callerLine) {
            return null;
        }

        return this._parseStackLine(callerLine);
    }

    _parseStackLine(line) {
        const withFunctionRegex = /^at\s+(?<name>.*?)\s+\((?<file>.*?):(?<line>\d+):(?<column>\d+)\)$/;
        const anonymousRegex = /^at\s+(?<file>.*?):(?<line>\d+):(?<column>\d+)$/;

        const withFunctionMatch = line.match(withFunctionRegex);
        if (withFunctionMatch?.groups) {
            return {
                name: withFunctionMatch.groups.name,
                file: withFunctionMatch.groups.file,
                line: Number(withFunctionMatch.groups.line),
                column: Number(withFunctionMatch.groups.column),
            };
        }

        const anonymousMatch = line.match(anonymousRegex);
        if (anonymousMatch?.groups) {
            return {
                name: '<anonymous>',
                file: anonymousMatch.groups.file,
                line: Number(anonymousMatch.groups.line),
                column: Number(anonymousMatch.groups.column),
            };
        }

        return null;
    }
}