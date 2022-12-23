const winston = require('winston');

const handleRequestFormat = winston.format.printf((data) => {
    const { level, message, timestamp } = data;
    const args = data[Symbol.for('splat')][0];

    return `${timestamp} ${level.toUpperCase()}: ${message} | request #${args.requestNumber}`;
});

const requestLoggerFormat = winston.format.printf((data) => {
    const { level } = data;
    const args = data[Symbol.for('splat')][0];

    if(winston.config.syslog.levels[level] == winston.config.syslog.levels.info) {
        return `Incoming request | #${args.requestNumber} | resource: ${args.resourceName} | HTTP Verb ${args.httpVerb}`;
    } else {
        return `request #${args.requestNumber} duration: ${args.duration}ms`;
    }
});

const requestLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        requestLoggerFormat
    ),
    transports: [
      new winston.transports.File({ filename: './logs/requests.log' }),
      new winston.transports.Console
    ],
});

const stackLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        handleRequestFormat
    ),
    transports: [
      new winston.transports.File({ filename: './logs/stack.log' }),
    ],
});

const independentLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        handleRequestFormat
    ),
    transports: [
      new winston.transports.File({ filename: './logs/independent.log' })
    ],
});

module.exports = {requestLogger, stackLogger, independentLogger};