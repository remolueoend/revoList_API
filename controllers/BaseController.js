/**
 * Created by remo on 25/10/14.
 */

'use strict';

var inherit = require('node-inherit').inherit;

function BaseController(context){
    this.context = context;
    this.db = context.db;
}

BaseController.inherit = function(prototype){

    return inherit(BaseController, function(context){
        BaseController.call(this, context);
    }, prototype);
};

module.exports = BaseController;