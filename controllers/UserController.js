/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    inherit = require('node-inherit').inherit,
    RestController = require('./RestController');

module.exports = inherit(RestController, function(context){
    RestController.call(this, context);
}, {
    me: function(){
        return monk(this.db('user').findOne({
            id: this.context.req.user.id
        }));
    }
});

/*
module.exports = require('./RestController').inherit({

    me: function(){
        return monk(this.db('user').findOne({
            id: this.context.req.user.id
        }));
    }

});
*/