/**
 * Created by remo on 16/10/14.
 */

'use strict';

/**
 * This module provides validators for specific action arguments.
 * @type {Validator|exports}
 */

var modelValidator = require('./model-validator'),
    mongodb = require("mongodb"),
    objectid = mongodb.BSONPure.ObjectID;

/**
 * Validates the given id parameter.
 * @param {*} value The value provided by the client
 * @param {*} context The current controller context
 * @returns {Array} a collection of model validation errors.
 */
function idParam(value, context){
    if(value._bsontype !== 'ObjectID' && !objectid.isValid(value)){
        context.modelState.addError('id', 'Invalid id');
    }
}

/**
 * Validates the given request body.
 * @param {*} value The body provided by the client
 * @param {*} context The current controller context
 * @returns {Array} a collection of model validation errors.
 */
function body(value, context){
    var entity = context.entityName,
        def = require('../../models/' + entity),
        modelState = new modelValidator(value, def, context.modelState);
    modelState.validate();
}

module.exports = {
    idParam: idParam,
    body: body
};