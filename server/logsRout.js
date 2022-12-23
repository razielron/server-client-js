const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const {stackLogger, independentLogger, requestLogger} = require('./logger');

function handleGetLevel(req, res) {
    let loggerName = req?.query['logger-name'];
    let loggerLevel;

    if(!loggerName) {
        res.status( StatusCodes.CONFLICT );
        res.send("Wrong request query!");
    }

    if(loggerName == 'request-logger') {
        loggerLevel = requestLogger.level;
    } else if(loggerName == 'stack-logger') {
        loggerLevel = stackLogger.level;
    } else if(loggerName == 'independent-logger') {
        loggerLevel = independentLogger.level;
    }

    res.send(loggerLevel.toUpperCase());
}

function handlePutLevel(req, res) {
    let loggerName = req?.query['logger-name'];
    let loggerLevel = req?.query['logger-level'];

    if(!loggerName || !loggerLevel) {
        res.status( StatusCodes.CONFLICT );
        res.send("Wrong request query!");
    }

    if(loggerName == 'request-logger') {
        requestLogger.level = loggerLevel.toLowerCase();
    } else if(loggerName == 'stack-logger') {
        stackLogger.level = loggerLevel.toLowerCase();
    } else if(loggerName == 'independent-logger') {
        independentLogger.level = loggerLevel.toLowerCase();
    }

    res.send(loggerLevel.toUpperCase());
}

const router = express.Router();
router.get('/level', (req, res, next) => { handleGetLevel(req, res); next(); } );
router.put('/level', (req, res, next) => { handlePutLevel(req, res); next(); } );

module.exports = router;