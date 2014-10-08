/**
 * Created by remo on 06/10/14.
 */

'use strict';

var c = require('../constants'),
    ctrlInvoker = require('./controller-invoker'),
    actionInvoker = require('./action-invoker'),
    path = require('path');

/**
 * Registers and handles RESTful API requests.
 * This function can be used as a class or called directly.
 * @param {object} app The current express app instance
 * @returns {RestRouter}
 * @constructor
 */
function RestRouter(app){
    if(!(this instanceof RestRouter)){
        return new RestRouter(app);
    }
    this.app = app;
    this.controllerInvoker = new ctrlInvoker(path.join(__dirname, '../../controllers'));
    this.register(app);
}
RestRouter.prototype = {

    /**
     * Registers the RESTful API route (/:entity/:id)
     */
    register: function(){
        var self = this;
        this.app.use('/:' + c.entityParamName + '/:' + c.idParamName + '?', function(){ self.handle.apply(self, arguments); });
    },

    /**
     * Handles the routed request by invoking the requested controller and its action.
     * @param {object} req The current request object
     * @param {object} res The current response object
     * @param {function} next The caller for the next middleware function.
     */
    handle: function(req, res, next){
        var ctrlContext = this.controllerInvoker.invoke(req, res);
        var actionResult = actionInvoker.invokeAction(ctrlContext);
        this.writeResponse(actionResult, req, res);
        /*
        try{
            var ctrlContext = this.controllerInvoker.invoke(req, res);
            actionInvoker.invokeAction(ctrlContext);
        }catch(err){
            next(err);
            throw err;
        }
        */
    },

    /**
     * Writes the called action's result to the response and ends it.
     * @param {*} actionResult The result returned by the called action
     * @param {object} req The current request object
     * @param {object} res The current response object
     */
    writeResponse: function(actionResult, req, res){
        if(typeof actionResult !== undefined){
            res.json(actionResult);
        }
        res.end();
    }
};

module.exports = RestRouter;