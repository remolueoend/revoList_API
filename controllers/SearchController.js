/**
 * Created by remo on 17/11/14.
 */

'use strict';

var youtube = require('../contentProviders/youtube'),
    soundcloud = require('../contentProviders/soundcloud'),
    defer = require('deferred'),
    inherit = require('node-inherit').inherit,
    BaseController = require('./BaseController');

module.exports = inherit(BaseController, function(context){
    BaseController.call(this, context);
}, {

    /**
     * Returns a collection of tracks matching the given query.
     * @url GET /search?q=QUERY
     * @param query
     * @param deferred
     */
    getAll: function(query, deferred){
        var all = defer(youtube.query(query.q), soundcloud.query(query.q));
        all.then(function(result){
            var r = [];
            for(var i = 0; i < result.length; i++){
                r = r.concat(result[i]);
            }
            deferred.resolve(r);
        });
    }
});