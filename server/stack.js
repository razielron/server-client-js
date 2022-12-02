const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const operationsList = require('./operations.json');
const {calculate, isBadOperation} = require('./calculate');
const {isValidBody} = require('./requestValidator');

const Stack = [];

function size(req, res) {
    res.json({result: Stack.length});
}

function putArguments(req, res) {
    let {arguments} = req.body;

    for(let i = 0; i < arguments.length; i++) {
        Stack.push(arguments[i]);
    }

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

        res.status( StatusCodes.BAD_REQUEST );
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
        res.status( StatusCodes.CONFLICT );
        res.json({ "error-message": errorMessage });
        return;
    }

    result = calculate({arguments, operation});
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
        res.status( StatusCodes.CONFLICT );
        res.json({ "error-message": errorMessage });
        return;
    }

    for(let i = 0; i < count; i++) {
        Stack.pop();
    }

    res.json({result: Stack.length});
}

const router = express.Router();

router.get('/size', (req, res) => { size(req, res ) } );
router.put('/arguments', (req, res) => { putArguments(req, res ) } );
router.get('/operate', (req, res) => { operate(req, res ) } );
router.delete('/arguments', (req, res) => { deleteArguments(req, res ) } );

module.exports = router;