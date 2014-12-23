/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    inherit = require('node-inherit').inherit,
    RestController = require('./RestController');

module.exports = inherit(RestController, function(context){
    RestController.call(this, context);
}, {

    /**
     * Returns the currently authenticated user instance.
     * @url GET /user/me
     * @returns {*}
     */
    me: function(){
        return monk(this.db('user').findOne({
            id: this.context.req.user.id
        }));
    },

    /**
     * Returns a collection of liked playlists of the user with the given id.
     * @ur GET /user/USER_ID/likes
     * @param id
     * @returns {*}
     */
    likes: function(id){
        return monk(this.db('playlist').find({likes: id}));
    }
});