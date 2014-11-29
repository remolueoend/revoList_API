/**
 * Created by remo on 19/11/14.
 */

'use strict';

var youtube = require('youtube-api');
var deferred = require('deferred');
var apiKey = 'AIzaSyBP-_HFBSZkVtAVC6dByv8ZeWTrJfiYC2s';

function query(q){
    var d = deferred();
    youtube.search.list({
        part: 'snippet,id',
        q: q,
        key: apiKey
    }, function(err, resp){
        if(err){
            d.reject(err);
        }else{
            d.resolve(resp.items);
        }
    });

    return d.promise;
}

module.exports = query;