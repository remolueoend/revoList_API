/**
 * Created by remo on 26/10/14.
 */

'use strict';

var db = require('../lib/db'),
    graph = require('fbgraph'),
    error = require('../lib/http-error');

module.exports = {
    getAccessToken: function(bearerToken, callback){
        var d = db();
        d('oauth_access_tokens').findOne({ access_token: bearerToken })
            .on("success", function(token){
                if(token){
                    token.user = token.user_id;
                    token.userId = token.user_id.id;
                    callback(null, token)
                }else{
                    callback();
                }
            })
            .on("error", function(err){
                callback(err);
            })
            .on('complete', function(){
                d.close();
            });
    },

    getClient: function(clientId, clientSecret, callback){

        // This code allows access to every app providing the following client/secret.
        // At the same time its a huge security-hole, huehue...
        if(clientId === 'revoList_webApp_client' && clientSecret === 'revoList_webApp_secret'){
            callback(null, { clientId: clientId, clientSecret: clientSecret });
            return;
        }
        var d = db();
        d('oauth_client').findOne({client_id: clientId})
            .on("success", function(client){

                if(!client || clientSecret !== null && client.client_secret !== clientSecret) return callback();

                callback(null, {
                    clientId: client.client_id,
                    clientSecret: client.client_secret
                });

            })
            .on("error", function(err){
                callback(err);
            })
            .on('complete', function(){
                d.close();
            });
    },

    getRefreshToken: function(bearerToken, callback){
        var d = db();
        d('oauth_refresh_tokens').findOne({refresh_token: bearerToken})
            .on('success', function(token){
                callback(null, token ? token : false);
            })
            .on('error', function(err){
                callback(err);
            })
            .on('complete', function(){
                d.close();
            });
    },

    grantTypeAllowed: function(clientId, grantType, callback){
        callback(false, true);
    },

    saveAccessToken: function (accessToken, clientId, expires, userId, callback) {
        var d = db();
        d('oauth_access_tokens').insert({
            access_token: accessToken,
            client_id: clientId,
            user_id: userId,
            expires: expires
        })
            .on('success', function(){
                callback();
            })
            .on('error', function(err){
                callback(err);
            })
            .on('complete', function(){
                d.close();
            });
    },

    getUser: function(username, password, callback){
        graph.get('/' + username + '?access_token=' + password, function(err, resp){
            if(err) {
                callback(false, false);
            }else{
                var d = db();
                d('user').findOne({id: username})
                    .on('success', function(data){
                        if(data){
                            if(data.lastName !== resp.last_name || data.firstName !== resp.first_name || !data.fullName){
                                d('user').update({_id: data._id}, {id: username, lastName: resp.last_name, firstName: resp.first_name, fullName: resp.first_name + ' ' + resp.last_name})
                                    .complete(function(){
                                        d.close();
                                        callback(false, {id: username });
                                    });
                            }else{
                                callback(false, data);
                                d.close();
                            }

                        }else{
                            d('user').insert({id: username, lastName: resp.last_name, firstName: resp.first_name})
                                .on('success', function(data){
                                    callback(null, data);
                                })
                                .on('error', function(err){
                                    throw err;
                                })
                                .on('complete', function(){
                                    d.close();
                                });
                        }
                    })
                    .on('error', function(err){
                        d.close();
                        callback(err);
                    });
            }
        });
    }
};