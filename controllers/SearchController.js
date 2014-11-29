/**
 * Created by remo on 17/11/14.
 */

'use strict';

var youtube = require('../contentProviders/youtube');

module.exports = require('./BaseController').inherit({

    getAll: function(query, deferred){
        youtube(query.q).then(function(data){
            deferred.resolve(data);
        });
    }

});