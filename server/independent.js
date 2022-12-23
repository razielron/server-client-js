const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const operationsList = require('./operations.json');
const {calculate, isBadOperation} = require('./calculate');
const {isValidBody} = require('./requestValidator');
const { independentLogger } = require('./logger');
const { append } = require('express/lib/response');

function printLog(operation, arguments, result, requestCounter) {
    let stringArguments = arguments.join(',');
    let meta = { requestNumber: requestCounter }

    independentLogger.info(`Performing operation ${operation}. Result is ${result}`, meta);
    independentLogger.debug(`Performing operation: ${operation}(${stringArguments}) = ${result}`, meta);
}

function calculateAPI(req, res) {
    let errorMessage, result;
    let arguments = req.body.arguments;
    let operation = req.body.operation;

    if(errorMessage = isValidBody(arguments, operation)) {
        res.status( StatusCodes.BAD_REQUEST );
        res.json({ "error-message": errorMessage });
        return;
    }

    operation = operation.toLowerCase();

    if(errorMessage = isBadOperation(arguments, operation)) {
        res.status( StatusCodes.CONFLICT );
        res.json({ "error-message": errorMessage });
        return;
    }

    result = calculate({arguments, operation});
    printLog(req.body.operation, arguments, result, req.app.locals.requestCounter);
    res.json({ result });
}

const router = express.Router();

router.post('/calculate', (req, res, next) => { calculateAPI(req, res); next(); } );

module.exports = router;