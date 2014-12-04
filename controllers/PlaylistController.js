/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('../lib/action-result').monk;

module.exports = require('./BaseController').inherit({

    search: function(query){
        var regex = new RegExp('.*' + query.q + '.*');
        return monk(this.db('playlist').find({title: regex}));
    }

});