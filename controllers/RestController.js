/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    inherit = require('node-inherit').inherit;

var RestController = require('./BaseController').inherit({
    get: function(id){
        return monk(this.db(this.context.entityName).findById(id));
    },
    getAll: function(actionQuery){
        return monk(this.db(this.context.entityName).find(actionQuery));
    },
    update: function(id, body){
        return monk(this.db(this.context.entityName).updateById(id, body));
    },
    create: function(body){
        return monk(this.db(this.context.entityName).insert(body));
    },
    remove: function(id){
        return monk(this.db(this.context.entityName).remove({_id: id}));
    }
});

RestController.inherit = function(prototype){

    return inherit(RestController, function(context){
        RestController.call(this, context);
    }, prototype);
};

module.exports = RestController;