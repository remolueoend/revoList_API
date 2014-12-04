/**
 * Created by remo on 01/12/14.
 */

'use strict';

module.exports = function(){

    return function(req, res, next){
        var q = JSON.parse(JSON.stringify(req.query));
        delete q.access_token;
        req.actionQuery = q;
        next();
    };

};