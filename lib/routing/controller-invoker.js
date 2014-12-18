/**
 * Created by remo on 06/10/14.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    error = require('../http-error'),
    c = require('../constants'),
    db = require('../db'),
    deferred = require('deferred');

/**
 * Allows invoking a controller.
 * @param {string} basePath The base path of the controller directory.
 * @constructor
 */
function ControllerInvoker(basePath){
    this.basePath = basePath;
}
ControllerInvoker.prototype = {

    /**
     * Invokes a controller based on the current request and returns
     * a controller request wrapping the invoked controller.
     * @param {object} req The current request object
     * @param {object} res The current response object
     */
    invoke: function invoke(req, res){
        var entity = req.routeValue('entity');
        if(entity == null || !entity.length){
            throw error.badRequest("Missing entity");
        }
        var ctrlName = this.getCtrlName(entity);
        var ctrlFile = this.getCtrlFile(ctrlName);
        if(typeof ctrlFile === "undefined"){
            throw error.notFound("The controller '" + ctrlName + "' could not be found.");
        }

        var ctrlFn = require(path.join(this.basePath, ctrlFile));
        var d = deferred();
        var ctx = new ControllerContext(entity, req, res, d);
        var ctrl = new ctrlFn(ctx);
        ctx.controller = ctrl;

        return ctx;
    },

    /**
     * Returns the name of the controller handling the provided entity.
     * @param {string} entityName The name of the entity.
     */
    getCtrlName: function(entityName){
        var en =
            entityName.substring(0, 1).toUpperCase() +
            entityName.substring(1).toLowerCase();

        // user => UserController, playlist => PlaylistController
        return en + "Controller";
    },

    /**
     * Returns the controller file for the specified ctrl name.
     * If the provided controller does not exist, undefined will be returned.
     * @param {string} ctrlName The name of the controller.
     */
    getCtrlFile: function(ctrlName){

        // Look for cached controller file list
        if(!(ControllerInvoker.ctrlFiles instanceof Array)){
            if(!fs.statSync(this.basePath).isDirectory()){
                throw error.serverError("'" + this.basePath + "' is not a valid controller directory.");
            }
            ControllerInvoker.ctrlFiles = fs.readdirSync(this.basePath);
        }
        var ctrlFiles = ControllerInvoker.ctrlFiles;
        var ctrlFile = ctrlFiles.filter(function(f){ return path.basename(f, ".js") === ctrlName; });
        return ctrlFile[0];
    }
};

/**
 * Wraps an invoked controller.
 * @constructor
 */
function ControllerContext(entity, req, res, deferred){
    this.entityName = entity;
    this.controller = undefined;
    this.req = req;
    this.res = res;
    this.d = deferred;
    this.db = db();
}

module.exports = ControllerInvoker;