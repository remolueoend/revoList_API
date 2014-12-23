/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    inherit = require('node-inherit').inherit,
    BaseController = require('./BaseController');

var RestController = inherit(BaseController, function(context){
    BaseController.call(this, context);
}, {
    /**
     * Returns a single document from the inherited entity type with the given id.
     * @url GET /ENTITY_TYPE/ID
     * @param id
     * @returns {*}
     */
    get: function(id){
        return monk(this.db(this.context.entityName).findById(id));
    },

    /**
     * Returns a collection of documents of the inherited entity type
     * matching the given query.
     * @url GET /ENTITY_TYPE[?queryFilters]
     * @param actionQuery
     * @returns {*}
     */
    getAll: function(actionQuery){
        return monk(this.db(this.context.entityName).find(actionQuery));
    }

    // This methods are disabled to avoid access to queries which are perhaps
    // not allowed on certain entity types.
    /*
    update: function(id, body){
        return monk(this.db(this.context.entityName).updateById(id, body));
    },
    create: function(body){
        return monk(this.db(this.context.entityName).insert(body));
    },
    remove: function(id){
        return monk(this.db(this.context.entityName).remove({_id: id}));
    }
    */
});

module.exports = RestController;