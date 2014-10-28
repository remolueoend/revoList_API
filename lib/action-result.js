/**
 * Created by remo on 09/10/14.
 */

'use strict';

var resultHandlers = {
    __monk: parse_monk
};

/**
 * Parses an action result and returns a promise which resolves
 * the data to send to the client.
 * @param {*} result The result returned by the action
 * @param {deferred} deferred The deferred object of the current context
 * @param {object} req The current request object
 * @returns {adapter.deferred.promise|*|defer.promise|promise|Promise.deferred.promise|Deferred.promise}
 */
function parse(result, deferred, req){
    if(typeof result === "object"){
        for(var p in result){
            if(result.hasOwnProperty(p) && typeof resultHandlers[p] !== "undefined"){
                resultHandlers[p](result[p], deferred, req);
            }
        }
    }

    return deferred.promise;

}

function parse_monk(result, d, req){
    result.on("success", function(data){
        var method = req.method;

        if(method.toLowerCase() === 'put'){
            d.resolve(req.body);
        }else{
            d.resolve(data);
        }
    });
    result.on("error", function(err){
        d.reject(err);
    });
}

function monk(query){
    return {__monk: query};
}

module.exports = {
    parse: parse,
    monk: monk
};

