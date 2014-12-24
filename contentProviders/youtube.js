/**
 * Created by remo on 19/11/14.
 */

'use strict';

var youtube = require('youtube-api');
var deferred = require('deferred');
var apiKey = 'AIzaSyBP-_HFBSZkVtAVC6dByv8ZeWTrJfiYC2s';

module.exports = {
    query: function(q){
        var d = deferred();
        youtube.search.list({
            part: 'snippet,id',
            q: q,
            key: apiKey,
            maxResults: 15
        }, function(err, resp){
            if(err){
                d.reject(err);
            }else{
                d.resolve(resp.items.map(function(i){
                    return {
                        id: i.id.videoId,
                        title: i.snippet.title,
                        author: i.snippet.channelTitle,
                        thumbnail: i.snippet.thumbnails.medium.url,
                        provider: 'youtube'
                    };
                }).filter(function(i){ return i.id != null; }));
            }
        });

        return d.promise;
    }
};