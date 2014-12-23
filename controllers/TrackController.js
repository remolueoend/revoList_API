/**
 * Created by remo on 18/12/14.
 */

'use strict';

var inherit = require('node-inherit').inherit,
    RestController = require('./RestController');

/**
 * Controller managing 'track' entities.
 * This controller inherits all its action from 'RestController'.
 */
module.exports = inherit(RestController, function(context){
    RestController.call(this, context);
}, { });
