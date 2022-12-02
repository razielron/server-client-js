const express = require('express')
const StatusCodes = require('http-status-codes').StatusCodes;
const operationsList = require('./operations.json');
const {calculate, isBadOperation} = require('./calculate');
const {isValidBody} = require('./requestValidator');

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
    res.json({ result });
}

const router = express.Router();

router.post('/calculate', (req, res) => { calculateAPI(req, res ) } );

module.exports = router;