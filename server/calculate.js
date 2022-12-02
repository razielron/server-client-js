const operationsList = require('./operations.json');

function isBadOperation(arguments, operation) {
    operation = operation.toLowerCase();
    
    if(operation == operationsList.DIVIDE && arguments[1] == 0) {
        return `Error while performing operation Divide: division by 0`;
    }

    if(operation == operationsList.FACT && arguments[0] < 0) {
        return `Error while performing operation Factorial: not supported for the negative number`;
    }
}

function factorial(n) {
    if (n < 0) return;
    if (n < 2) return 1;
    return n * factorial(n - 1);
}

function calculate({arguments, operation}) {
    if(operation == operationsList.PLUS) {
        return arguments[0] + arguments[1];
    }

    if(operation == operationsList.MINUS) {
        return arguments[0] - arguments[1];
    }

    if(operation == operationsList.TIMES) {
        return arguments[0] * arguments[1];
    }

    if(operation == operationsList.DIVIDE) {
        return parseInt(arguments[0] / arguments[1]);
    }

    if(operation == operationsList.POW) {
        return arguments[0] ^ arguments[1];
    }

    if(operation == operationsList.ABS) {
        return Math.abs(arguments[0]);
    }

    if(operation == operationsList.FACT) {
        return factorial(arguments[0]);
    }
}

module.exports = {calculate, isBadOperation};