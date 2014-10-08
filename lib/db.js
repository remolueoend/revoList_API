/**
 * Created by remo on 06/10/14.
 */

'use strict';

var monk = require('monk');

/**
 * Returns a monk wrapper for the specified collection.
 * @param {string} collection The name of the collection.
 * @returns {*}
 */
function db(collection){
    return monk.get(collection);
}

module.exports = db;