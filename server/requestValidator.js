const operationsList = require('./operations.json');

function isValidBody(arguments, operation, shouldTestTooMuch = true) {
    operation = operation.toLowerCase();

    if(!Array.isArray(arguments)) {
        return `Error: arguments is not an array`;
    }
    
    if(!(operation.toUpperCase() in operationsList)) {
        return `Error: unknown operation: ${operation}`;
    }

    if(operation != operationsList.ABS
        && operation != operationsList.FACT
        && arguments.length < 2) {
        return `Error: Not enough arguments to perform the operation ${operation}`;
    }

    if(shouldTestTooMuch
        &&operation != operationsList.ABS
        && operation != operationsList.FACT
        && arguments.length > 2) {
        return `Error: Too many arguments to perform the operation ${operation}`;
    }

    if((operation == operationsList.ABS || operation == operationsList.FACT)
        && arguments.length < 1) {
        return `Error: Not enough arguments to perform the operation ${operation}`;
    }

    if(shouldTestTooMuch
        &&(operation == operationsList.ABS || operation == operationsList.FACT)
        && arguments.length > 1) {
        return `Error: Too many arguments to perform the operation ${operation}`;
    }
}

module.exports = { isValidBody };