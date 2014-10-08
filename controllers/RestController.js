/**
 * Created by remo on 06/10/14.
 */

'use strict';

function RestController(context, req, res){
    this.context = context;
    this.req = req;
    this.res = res;
}
RestController.prototype = {
    get: function(id){
        return {method: "get", entity: this.context.entityName};
    },
    getAll: function(query){
        var x = "x";
    },
    update: function(id, body){
        return {method: "post", entity: this.context.entityName};
    },
    create: function(body){
        return {method: "put", entity: this.context.entityName};
    },
    remove: function(id){
        return {method: "delete", entity: this.context.entityName};
    }
};

module.exports = RestController;