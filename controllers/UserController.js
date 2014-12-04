/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    graph = require('fbgraph');

module.exports = require('./RestController').inherit({

    me: function(deferred){
        return monk(this.db('user').findOne({
            id: this.context.req.user.id
        }));
    }

});