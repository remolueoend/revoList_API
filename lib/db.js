/**
 * Created by remo on 06/10/14.
 */

'use strict';

var c = require('./constants');

function db(){
    var conn;
    if(c.db.user()){
        conn = require('monk')('mongodb://' + c.db.user() + ':' + c.db.password() + '@' + c.db.host() + ':' + c.db.port())
    }else{
        conn = require('monk')(c.db.getConnectionString());
    }

    var fn = function(collection){
        return conn.get(collection);
    };
    fn.close = function(){
        conn.close();
    };
    return fn;
}

module.exports = db;