const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const operationsList = require('./operations.json');
const {calculate, isBadOperation} = require('./calculate');
const {isValidBody} = require('./requestValidator');
const {stackLogger} = require('./logger');

const Stack = [];

function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}

function logErrorMessage(req, errorMessage) {
    let meta = { requestNumber: req.app.locals.requestCounter };
    stackLogger.error(`Server encountered an error ! message: ${errorMessage}`, meta);
}

function size(req, res) {
    let meta = { requestNumber: req.app.locals.requestCounter };
    let reveredStack = reverseArr(Stack);
    
    stackLogger.info(`Stack size is ${Stack.length}`, meta);
    stackLogger.debug(`Stack content (first == top): [${reveredStack.join(', ')}]`, meta);
    res.json({result: Stack.length});
}

function putArguments(req, res) {
    let {arguments} = req.body;
    let oldStuckSize = Stack.length;

    for(let i = 0; i < arguments.length; i++) {
        Stack.push(arguments[i]);
    }

    let meta = { requestNumber: req.app.locals.requestCounter };
    stackLogger.info(`Adding total of ${arguments.length} argument(s) to the stack | Stack size: ${Stack.length}`, meta);
    stackLogger.debug(`Adding arguments: ${arguments.join(',')} | Stack size before ${oldStuckSize} | stack size after ${Stack.length}`, meta);
    res.json({result: Stack.length});
}

function operate(req, res) {
    let errorMessage, result;
    let operation = req?.query?.operation;
    let arguments = [];

    operation = operation.replaceAll('\'', '');
    operation = operation.replaceAll('"', '');
    operation = operation.toLowerCase();

    if(errorMessage = isValidBody(Stack, operation, false)) {
        if(errorMessage.includes('enough')){
            let argNum = (operation == operationsList.FACT || operation == operationsList.ABS) ? 1 : 2;
            errorMessage = `Error: cannot implement operation ${operation}. It requires ${argNum} arguments and the stack has only ${Stack.length} arguments`;
        }

        logErrorMessage(req, errorMessage);
        res.status( StatusCodes.CONFLICT );
        res.json({ "error-message": errorMessage });
        return;
    }

    if(operation != operationsList.FACT && operation != operationsList.ABS) {
        arguments.push(Stack.pop());
    }

    arguments.push(Stack.pop());

    if(errorMessage = isBadOperation(arguments, operation)) {
        if(operation != operationsList.FACT && operation != operationsList.ABS) {
            Stack.push(arguments.pop());
        }
    
        Stack.push(arguments.pop());
        logErrorMessage(errorMessage);
        res.status( StatusCodes.CONFLICT );
        res.json({ "error-message": errorMessage });
        return;
    }

    result = calculate({arguments, operation});
    let meta = { requestNumber: req.app.locals.requestCounter };
    stackLogger.info(`Performing operation ${req?.query?.operation}. Result is ${result} | stack size: ${Stack.length}`, meta);
    stackLogger.debug(`Performing operation: ${req?.query?.operation}(${arguments.join(',')}) = ${result}`, meta);
    res.json({ result });
}

function deleteArguments(req, res) {
    let count = req?.query?.count;

    count = count.toString();
    count = count.replaceAll('\'', '');
    count = count.replaceAll('"', '');
    count = parseInt(count);

    if(count > Stack.length) {
        let errorMessage = `Error: cannot remove ${count} from the stack. It has only ${Stack.length} arguments`;
        logErrorMessage(errorMessage);
        res.status( StatusCodes.CONFLICT );
        res.json({ "error-message": errorMessage });
        return;
    }

    for(let i = 0; i < count; i++) {
        Stack.pop();
    }

    let meta = { requestNumber: req.app.locals.requestCounter };
    stackLogger.info(`Removing total ${count} argument(s) from the stack | Stack size: ${Stack.length}`, meta);
    res.json({result: Stack.length});
}

const router = express.Router();

router.get('/size', (req, res, next) => { size(req, res); next(); } );
router.put('/arguments', (req, res, next) => { putArguments(req, res); next(); } );
router.get('/operate', (req, res, next) => { operate(req, res); next(); } );
router.delete('/arguments', (req, res, next) => { deleteArguments(req, res); next(); } );

module.exports = router;