/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    inherit = require('node-inherit').inherit,
    RestController = require('./RestController'),
    error = require('../lib/http-error'),
    deferred = require('deferred'),
    mongodb = require('mongodb');

module.exports = inherit(RestController, function(context){
    RestController.call(this, context);
}, {

    /**
     * Returns a collection of playlists matching the given query and sorted descending by likes.
     * @url GET /playlist[?queryFilters]
     * @param actionQuery
     * @returns {*}
     */
    getAll: function(actionQuery){
        return monk(this.db('playlist').find(actionQuery, {sort: {likesCount: -1}}));
    },

    /**
     * Creates a new playlist filled with the data sent with the request body.
     * @url POST /playlist
     * @param body
     * @param req
     * @param user
     * @returns {*}
     */
    create: function(body, req, user){
        body.owner = user._id;
        var _this = this;
        this.db('playlist').findOne({owner: user._id, title: body.title}).success(function(p){
            if(p){
                _this.context.modelState.addError('title', 'There is already a playlist with the same title.');
                _this.context.d.reject();
            }else{
                _this.db('playlist').insert(body).success(function(p){
                    _this.context.d.resolve(p);
                });
            }
        });
    },

    /**
     * Returns a collection of playlists whose title match the given query
     * @url GET /playlist/search?q=queryString
     * @param query
     * @returns {*}
     */
    search: function(query){
        var regex = new RegExp('.*' + decodeURI(query.q) + '.*', "i");
        return monk(this.db('playlist').find({title: regex}, {sort: {likesCount: -1}}));
    },

    /**
     * Returns the collection of playlists of the current authorized user.
     * @url GET /playlist/my
     * @param req
     * @returns {*}
     */
    my: function(req){
        return monk(this.db('playlist').find({ owner: req.user._id }, {sort: {likesCount: -1}}));
    },

    /**
     * Returns a collection of extended playlists containing additional information to the given trackId and track provider.
     * @url GET /playlist/byTrack/TRACK_PROVIDER/TRACK_ID
     * @param query
     * @param req
     * @param deferred
     */
    byTrack: function(query, req, deferred){
        var _this = this;

        _this.db('track').findOne({id: req.param('trackId'), provider: req.param('provider')}).success(function(track){
            if(!track){
                _this.db('playlist').find({ owner: req.user._id }).success(function(pls){
                    deferred.resolve(pls);
                });
            }else{
                _this.db('playlist').find({ owner: req.user._id, tracks: track._id }).success(function(selectedPls){
                    selectedPls = selectedPls.map(function(p){
                        p.selected = true;
                        return p;
                    });
                    _this.db('playlist').find({
                        owner: req.user._id,
                        tracks: {
                            $nin: [track._id]
                        }
                    }).success(function(notSelectedPls){
                        deferred.resolve(selectedPls.concat(notSelectedPls));
                    });
                });
            }
        });


    },

    /**
     * Adds a track to the playlist with the given id.
     * The track instance must be sent in the request body.
     * @url /playlist/PLAYLIST_ID/addTrack
     * @param body
     * @param deferred
     * @param query
     * @param id
     */
    addTrack: function(body, deferred, query, id){
        var _this = this;
        _this.db('track').findOne({provider: body.provider, id: body.id}).success(function(extTrack){
            if(extTrack != null){
                _this.addExistingTrack(id, extTrack);
            }else{
                _this.db('track').insert(body).success(function(newTrack){
                    _this.addExistingTrack(id, newTrack);
                });
            }

        });
    },

    /**
     * Adds an existing track DB-instance to a playlist.
     * This action may not be called by a client directly. Use 'addTrack' instead.
     * @param playlistId
     * @param track
     */
    addExistingTrack: function(playlistId, track){
        var _this = this;
        this.isOwnPlaylist(playlistId).then(function(){
            _this.db('playlist').update({_id: playlistId, tracks: {$nin: [track._id]}}, {$push: { tracks: track._id }}).success(function(){
                _this.context.d.resolve();
            });
        });
    },

    /**
     * Removes a track from the playlist with the given id.
     * The track instance must be sent withing the request body.
     * @url POST /playlist/PLAYLIST_ID/removeTrack
     * @param id
     * @param body
     */
    removeTrack: function(id, body){
        var _this = this;
        this.isOwnPlaylist(id).then(function(){
            _this.db('track').findOne({provider: body.provider, id: body.id}).success(function(extTrack){
                _this.db('playlist').update({_id: id, tracks: extTrack._id}, {$pull: {tracks: extTrack._id}}).success(function(){
                    _this.context.d.resolve();
                });
            });
        });
    },

    /**
     * Changes the title of a playlist with the given id.
     * @url GET /playlist/PLAYLIST_ID/changeTitle?title=NEWTITLE
     * @param id
     * @param actionQuery
     */
    changeTitle: function(id, actionQuery, user){
        var _this = this;
        this.isOwnPlaylist(id).then(function(){
            _this.db('playlist').findOne({_id: {$ne: id}, owner: user._id, title: actionQuery.title}).success(function(p){
                if(p){
                    _this.context.modelState.addError('title', 'There is already a playlist with the same title.');
                    _this.context.d.reject();
                }else{
                    _this.db('playlist').update({_id: id}, { $set: { title: actionQuery.title } }).success(function(){
                        _this.context.d.resolve();
                    });
                }
            });
        });
    },

    /**
     * Adds a like to the playlist with the given id.
     * @url GET /playlist/PLAYLIST_ID/like
     * @param id
     * @param user
     */
    like: function(id, user){
        var _this = this;
        this.isOwnPlaylist(id, true).then(function(){
            _this.db('playlist').update({_id: id, likes: {$nin: [user._id]}}, {$push: { likes:  user._id}, $inc: {likesCount: 1}}).success(function(){
                _this.context.d.resolve();
            });
        });
    },

    /**
     * Removes a like to the playlist with the given id.
     * @url GET /playlist/PLAYLIST_ID/dislike
     * @param id
     * @param user
     */
    dislike: function(id, user){
        var _this = this;
        this.isOwnPlaylist(id, true).then(function(){
            _this.db('playlist').update({_id: id, likes: user._id}, {$pull: { likes:  user._id}, $inc: {likesCount: -1}}).success(function(){
                _this.context.d.resolve();
            });
        });
    },

    remove: function(id){
        return monk(this.db('playlist').remove({_id: id}));
    },

    /**
     * Returns if a playlist with the given id is owned by the currently authenticated user.
     * This method should not be called by a client directly.
     * @param playlistId
     * @param invert
     * @returns {*}
     */
    isOwnPlaylist: function(playlistId, invert){
        var d = deferred(),
            _this = this;
        this.db('playlist').findById(playlistId).success(function(p){
            if(p.owner.equals(_this.context.req.user._id)){
                if(!invert){
                    d.resolve();
                }else{
                    d.reject();
                    _this.context.d.reject(error.methodNotAllowed());
                }
            }else{
                if(invert){
                    d.resolve();
                }else{
                    d.reject();
                    _this.context.d.reject(error.methodNotAllowed());
                }
            }
        });

        return d.promise;
    }
});

