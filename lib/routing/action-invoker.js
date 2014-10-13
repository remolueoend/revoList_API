/**
 * Created by remo on 06/10/14.
 */

'use strict';

var c = require('../constants'),
    fnParse = require('../fn-parser'),
    actionResult = require('../action-result');

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
function invokeAction(controllerContext){
    var ctrl = controllerContext.controller,
        req = controllerContext.req,
        idParam = req.param(c.idParamName),
        method = req.method.toLowerCase() || "get",
        ar = undefined;

    // Look for an action called over URL => /entity/ActionName:
    if(typeof ctrl[idParam] === "function"){
        ar = invokeFn(ctrl[idParam], ctrl, req);
    }else{
        // Look for an action matching the current HTTP method.
        // If the method is get and there is no Id param, call action getAll instead:
        if(method === "get" && typeof idParam === "undefined"){
            method = "getAll";
        }

        var aName = actionNameMapping[method];
        if(typeof ctrl[aName] === "function"){
            ar = invokeFn(ctrl[aName], ctrl,  req);
        }else{
            // Throw a 404 exception:
            var err = new Error("Not Found");
            err.status = 404;
            throw err;
        }
    }

    return actionResult.parse(ar, controllerContext.d);
}

/**
 * Invokes an action with all requested arguments.
 * @param {function} fn The action function to invoke
 * @param {RestController} controller The controller instance
 * used as the actions context.
 * @param {object} req The current request object
 * @returns {*} The value returned by the action.
 */
function invokeFn(fn, controller, req){
    var argsVal = new ActionArgsValueProvider(fn);
    argsVal.set(c.idParamName, req.param(c.idParamName));
    argsVal.set("body", req.body);
    argsVal.set("query", req.query);
    argsVal.set("req", req);
    argsVal.set("res", req.res);
    argsVal.set("deferred", controller.d);


    return fn.apply(controller, argsVal.getArgsArray());
}

/**
 * Helps creating an arguments array for calling an action.
 * @param {function} action The action to get the arguments array from
 * @constructor
 */
function ActionArgsValueProvider(action){
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
     * @param {String} argName The name of the argument to set
     * @param {String} value The vakue to set
     */
    set: function(argName, value){
        var i = this.actionArgs.indexOf(argName);
        if(i !== -1){
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