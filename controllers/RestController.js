/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk;

function RestController(context){
    this.context = context;
    this.d = context.d;
    this.db = context.db;
}
RestController.prototype = {
    get: function(id){
        return monk(this.db(this.context.entityName).findById(id));
    },
    getAll: function(query){
        return monk(this.db(this.context.entityName).find());
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
};

module.exports = RestController;