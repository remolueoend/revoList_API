/**
 * Created by remo on 01/12/14.
 */

'use strict';

var request = require('request'),
    server = 'http://api.soundcloud.com',
    clientKey = '8ed010422a034b2bac62339196673f9c',
    defer = require('deferred');

module.exports = {
    query: function(q){
        var deferred = defer();
        request.get({
            url: server + '/tracks.json',
            qs: {
                q: q,
                consumer_key: clientKey,
                order: 'hotness'
            }
        }, function(error, response, body){
            if(error){
                deferred.reject(error);
            }else{
                var b = JSON.parse(body);
                if(b.errors && b.errors.length){
                    deferred.reject(new Error(b.errors[0].error_message));
                }else{
                    deferred.resolve(b.map(function(i){
                        return {
                            id: i.id.toString(),
                            title: i.title,
                            author: i.user.username,
                            thumbnail: i.artwork_url,
                            provider: 'soundcloud'
                        };
                    }));
                }
            }
        });

        return deferred.promise;
    }
};