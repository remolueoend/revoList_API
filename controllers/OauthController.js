/**
 * Created by remo on 25/10/14.
 */

'use strict';

var inherit = require('node-inherit').inherit,
    BaseController = require('./BaseController'),
    graph = require('fbgraph');

var OauthController = inherit(BaseController, function OauthController(context){
    BaseController.call(this, context);
}, {
    token: function(query){
        var accessToken = query.accessToken,
            uid = query.userId,
            d = this.context.d;

        graph.get('/' + uid + '?access_token=' + accessToken, function(err, resp){
            this.db('user').findById(uid).on("success", function(data){

            });
            d.resolve(resp);
        });
    }
});

module.exports = OauthController;