/**
 * Created by remo on 17/12/14.
 */

'use strict';

var path = require('path'),
    extend = require('extend'),
    ctrlInvoker = require('./controller-invoker'),
    actionInvoker = require('./action-invoker'),
    c = require('../constants'),
    deferred = require('deferred'),
    error = require('../http-error');


var defOpts = {
    controllers: path.join(__dirname, '../../controllers')
};

function Rest(options){
    if(!(this instanceof Rest)){
        return new Rest(options);
    }

    this.options = extend({}, defOpts, options);
    this.controllerInvoker = new ctrlInvoker(this.options.controllers);
}
Rest.prototype = {

    handle: function(req, res, next, routeValues){
        this.applyRouteValues(req, routeValues);
        var ctrlContext = this.controllerInvoker.invoke(req, res);
        var actionResult = actionInvoker.invokeAction(ctrlContext, function(err){
            next(err);
        });

        if(deferred.isPromise(actionResult)){
            var self = this;
            actionResult.then(function(data){
                self.writeResponse(data, req, res);
                ctrlContext.db.close();
            }, function(err){
                ctrlContext.db.close();
                if(!err && !req.controllerContext.modelState.isValid()){
                    next(error.validation(req.controllerContext.modelState.errors));
                }
                next(err);
            });
        }else{
            this.writeResponse(actionResult, req, res);
            ctrlContext.db.close();
        }
    },

    applyRouteValues: function(req, providedValues){
        var baseParams = {
            entity: req.param(c.entityParamName),
            action: req.param(c.actionParamName),
            id: req.param(c.idParamName)
        };

        extend(baseParams, providedValues);

        req.routeValue = function(key){
            return baseParams[key];
        };
    },

    writeResponse: function(actionResult, req, res){
        if(typeof actionResult !== undefined){
            res.json(actionResult);
        }
        res.end();
    }
};

module.exports = function restFactory(options){
    var rest = new Rest(options);

    function callerFactory(routeValues, converters){
        return function caller(req, res, next){

            if(converters instanceof Array){
                converters.forEach(function(c){
                    c(req);
                });
            }

            rest.handle(req, res, next, routeValues);
        }
    }

    return function(routeValues, converters){
        return callerFactory(routeValues, converters);
    }
};