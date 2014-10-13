/**
 * Created by remo on 06/10/14.
 */

'use strict';

var c = require('./constants');

function db(){
    var conn = require('monk')(c.db.getConnectionString());
    var fn = function(collection){
        return conn.get(collection);
    };
    fn.close = function(){
        conn.close();
    };
    return fn;
}

module.exports = db;