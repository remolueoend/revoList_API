/**
 * Created by remo on 06/10/14.
 */

'use strict';

var RestController = require('./RestController'),
    inherit = require('node-inherit').inherit,
    override = require('node-inherit').override;

var PlaylistController = inherit(RestController, function(context){
    RestController.call(this, context);
});

override(PlaylistController.prototype, "delete", function(base){
    var result = base();
    result.override = true;
    return result;
});

module.exports = PlaylistController;