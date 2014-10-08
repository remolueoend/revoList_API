/**
 * Created by remo on 06/10/14.
 */

'use strict';

var RestController = require('./RestController'),
    inherit = require('node-inherit').inherit,
    override = require('node-inherit').override,
    error = require('../lib/http-error');

var UserController = inherit(RestController,
    function(context, req, res){
        RestController.call(this, context, req, res);
    }
);

override(UserController, "remove", function(base, id){
    throw error.methodNotAllowed("DELETE on 'user' is not allowed.");
});

module.exports = UserController;