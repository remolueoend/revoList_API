/**
 * Created by remo on 25/10/14.
 */

'use strict';

function BaseController(context){
    this.context = context;
    this.db = context.db;
}

module.exports = BaseController;