/**
 * Created by remo on 06/10/14.
 */

'use strict';

var http = require('http'),
    google = require('googleapis'),
    db = require('./db');

var server = http.createServer(onRequest);
var ApiKey = "AIzaSyBTzlLsmVXOPv8OdphwMoWOSB0tiPKxk6g";

/**
 * Gets executed for every incoming request.
 * @param {object} req The current request object.
 * @param {object} resp The current response object.
 */
function onRequest(req, resp){
    /*var youtube = google.youtube('v3');
    youtube.search.list({q: "Umse", auth: ApiKey, part: "snippet", type: "video"}, function(err, resp){
        var x = "";
    });*/
}

/**
 * Starts listening on the specified port.
 * @param {number} port The port number to listen on.
 */
function start(port){
    server.listen(port);
}

/**
 * Stops the se server from listening.
 */
function stop(){
    throw new Error("Not implemented yet.");
}

module.exports = {
    start: start,
    stop: stop
};