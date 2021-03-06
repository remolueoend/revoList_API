/**
 * Created by remo on 06/10/14.
 */

'use strict';

var c = require('../constants'),
    fnParse = require('../fn-parser'),
    actionResult = require('../action-result'),
    validator = require('../validation/request-validator'),
    error = require('../http-error');

/**
 * Provides a dictionary mapping HTTP methods
 * with the corresponding action names.
 * @type {{get: string, getAll: string, post: string, put: string, delete: string}}
 */
var actionNameMapping = {
    "get": "get",
    "getAll": "getAll",
    "post": "create",
    "put": "update",
    "delete": "remove"
};

/**
 * Invokes the requested action of the provided controller.
 * Which action is called depends on the HTTP method or action name.
 * @param {ControllerContext} controllerContext The current controller Context.
 */
function invokeAction(controllerContext, onError){
    var ctrl = controllerContext.controller,
        req = controllerContext.req,
        action = req.routeValue('action'),
        idParam = req.routeValue('id'),
        method = req.method.toLowerCase() || "get",
        ar = undefined;

    if(typeof action !== 'undefined'){
        if(typeof ctrl[action] !== 'undefined'){
            ar = invokeFn(ctrl[action], ctrl, req, onError);
        }else{
            onError(error.notFound());
        }
    }else if(typeof ctrl[idParam] === "function"){
        ar = invokeFn(ctrl[idParam], ctrl, req, onError);
    }else{
        // Look for an action matching the current HTTP method.
        // If the method is get and there is no Id param, call action getAll instead:
        if(method === "get" && typeof idParam === "undefined"){
            method = "getAll";
        }

        var aName = actionNameMapping[method];
        if(typeof ctrl[aName] === "function"){
            ar = invokeFn(ctrl[aName], ctrl,  req, onError);
        }else{
            onError(error.notFound());
        }
    }

    return actionResult.parse(ar, controllerContext.d, req);
}

/**
 * Invokes an action with all requested arguments.
 * @param {function} fn The action function to invoke
 * @param {RestController} controller The controller instance
 * used as the actions context.
 * @param {object} req The current request object
 * @returns {*} The value returned by the action.
 */
function invokeFn(fn, controller, req, onError){
    var argsVal = new ActionArgsValueProvider(fn, controller.context);
    argsVal.bind(c.idParamName, req.routeValue('id'), validator.idParam);
    argsVal.bind("body", req.body, validator.body);
    argsVal.bind("query", req.query);
    argsVal.bind("actionQuery", req.actionQuery);
    argsVal.bind("req", req);
    argsVal.bind("res", req.res);
    argsVal.bind("deferred", controller.context.d);
    argsVal.bind('user', req.user);

    if(!controller.context.modelState.isValid()){
        onError(error.validation(controller.context.modelState.errors));
    }else{
        return fn.apply(controller, argsVal.getArgsArray());
    }
}

/**
 * Helps creating an arguments array for calling an action.
 * @param {function} action The action to get the arguments array from
 * @param {ControllerContext} context The current controller context.
 * @constructor
 */
function ActionArgsValueProvider(action, context){
    this.context = context;
    var a = action, isOverride = false;
    if(typeof a.override === "function"){
        a = a.override();
        isOverride = true;
    }
    /**
     * Array containing all parameter names of the action.
     * @type {Array}
     */
    this.actionArgs = fnParse(a);
    if(isOverride){
        this.actionArgs.splice(0, 1);
    }
    this.argsArray = [];
}
ActionArgsValueProvider.prototype = {

    /**
     * Sets the value of an argument
     * @param {String} argName The name of the argument to bind
     * @param {String} value The value to bind
     * @param {function} [validator] An optional validator function
     */
    bind: function(argName, value, validator){
        var i = this.actionArgs.indexOf(argName);
        if(i !== -1){
            if(typeof validator === 'function') {
                validator(value, this.context);
            }
            this.argsArray[i] = value;
        }
    },

    /**
     * Returns the argument array to call the action
     * @returns {Array}
     */
    getArgsArray: function(){
        return this.argsArray;
    }
};

module.exports = {
    invokeAction: invokeAction
};