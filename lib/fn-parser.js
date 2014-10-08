/**
 * Created by remo on 07/10/14.
 */

'use strict';

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * Parses the given function's toString result and returns an array
 * of the names of the function's arguments.
 * @param {function} func The function to parse
 * @returns {Array|{index: number, input: string}}
 */
function parse(func){
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result
}

module.exports = parse;