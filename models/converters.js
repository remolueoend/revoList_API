/**
 * Created by remo on 18/12/14.
 */

'use strict';

var mongodb = require('mongodb');

module.exports = {

    ownerConverter: function(req){
        if(req.actionQuery.owner){
            req.actionQuery.owner = mongodb.ObjectID(req.actionQuery.owner);
        }
    },

    idConverter: function(req){
        if(req.params.id && mongodb.BSONPure.ObjectID.isValid(req.params.id)){
            req.params.id = mongodb.ObjectID(req.params.id);
        }
    }
};