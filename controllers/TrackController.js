/**
 * Created by remo on 18/12/14.
 */

'use strict';

var inherit = require('node-inherit').inherit,
    RestController = require('./RestController');

module.exports = inherit(RestController, function(context){
    RestController.call(this, context);
}, {

});
