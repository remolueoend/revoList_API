/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk,
    inherit = require('node-inherit').inherit,
    RestController = require('./RestController'),
    error = require('../lib/http-error'),
    deferred = require('deferred');

module.exports = inherit(RestController, function(context){
    RestController.call(this, context);
}, {

    create: function(body, req){
        body.owner = req.user._id;
        return monk(this.db('playlist').insert(body));
    },

    search: function(query){
        var regex = new RegExp('.*' + query.q + '.*');
        return monk(this.db('playlist').find({title: regex}));
    },

    my: function(req){
        return monk(this.db('playlist').find({ owner: req.user._id }));
    },

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

    addExistingTrack: function(playlistId, track){
        var _this = this;
        this.isOwnPlaylist(playlistId).then(function(){
            _this.db('playlist').update({_id: playlistId}, {$push: { tracks: track._id }}).success(function(){
                _this.context.d.resolve();
            });
        });
    },

    like: function(id, user){
        var _this = this;
        this.isOwnPlaylist(id, true).then(function(){
            _this.db('playlist').update({_id: id}, {$push: { likes:  user._id}}).success(function(){
                _this.context.d.resolve();
            });
        });
    },

    dislike: function(id, user){
        var _this = this;
        this.isOwnPlaylist(id, true).then(function(){
            _this.db('playlist').update({_id: id}, {$pull: { likes:  user._id}}).success(function(){
                _this.context.d.resolve();
            });
        });
    },

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

/*
module.exports = require('./BaseController').inherit({

    search: function(query){
        var regex = new RegExp('.*' + query.q + '.*');
        return monk(this.db('playlist').find({title: regex}));
    },

    addTrack: function(body, deferred, query){
        var _this = this;
        _this.db('track').findOne({provider: body.provider, id: body.id}).success(function(extTrack){
            if(extTrack != null){
                _this.addExistingTrack(query.playlistId, body);
            }else{
                _this.db('track').insert(body).success(function(){
                    _this.addExistingTrack(query.playlistId, body);
                });
            }

        });
    },

    addExistingTrack: function(playlistId, track){
        var _this = this;
        _this.db('playlist').update({_id: playlistId}, {$push: { tracks: track._id }}).success(function(){
            _this.context.d.resolve();
        });
    }

});

*/