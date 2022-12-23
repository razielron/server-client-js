const winston = require('winston');

const handleRequestFormat = winston.format.printf((data) => {
    const { level, message, timestamp } = data;
    const splat = data[Symbol.for('splat')];
    let args;
    
    if(splat) args = splat[0];

    return `${timestamp} ${level.toUpperCase()}: ${message} | request #${args?.requestNumber}`;
});

const requestLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        handleRequestFormat
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