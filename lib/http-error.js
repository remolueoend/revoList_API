/**
 * Created by remo on 06/10/14.
 */

/**
 * This module provides functions to create HTTP errors.
 * The functions do not throw the errors, instead they returning
 * The created error instance which can be thrown.
 * The message of the error is optional.
 * eg: throw error.notFound([msg]);
 */

'use strict';

function badRequest(msg){
    msg = msg || "The request was invalid.";
    return createError(msg, 400);
}

function serverError(msg){
    msg = msg || "An error occurred while processing the request.";
    return createError(msg, 500);
}

function notFound(msg){
    msg = msg || "The requested resource could not be found.";
    return createError(msg, 404);
}

function methodNotAllowed(msg){
    msg = msg || "The request method is not allowed.";
    return createError(msg, 405);
}

function validation(errors, msg){
    msg = msg || "One or more validation errors found.";
    var err = createError(msg, 409);
    err.validationErros = errors;
    return err;
}

function unAuthenticated(msg){
    msg = msg || "unauthenticated or invalid credentials.";
    return createError(msg, 401);
}

function createError(msg, status){
    var err = new Error(msg);
    err.status = status;
    return err;
}

module.exports = {
    badRequest: badRequest,
    serverError: serverError,
    notFound: notFound,
    methodNotAllowed: methodNotAllowed,
    validation: validation,
    unAuthenticated: unAuthenticated
};