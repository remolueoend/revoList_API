var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var error = require('./lib/http-error');
var oauthserver = require('node-oauth2-server');
var rest = require('./lib/routing/rest')();
var c = require('./lib/constants');
var converters = require('./models/converters');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.oauth = oauthserver({
    model: require('./auth/model'),
    grants: ['password'],
    debug: true,
    accessTokenLifetime: 3600 * 24
});

// Return 'Access-Control-Allow-' headers for each incoming requests.
// If the request method is 'OPTIONS', return an empty response, else call next middleware:
app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    if(req.method.toLowerCase() == 'options'){
        res.end();
    }else{
        next();
    }
});

// Register route for OAuth2 token interface:
app.all('/oauth/token', app.oauth.grant());

// Check Authentication for each incoming request:
app.all('*', app.oauth.authorise());

// This middleware prepares the request query which is used by several actions.
// This middleware must be called after the OAuth2 authentication!
app.use(require('./lib/actionQuery')());


/**
 * REST route definitions
 */
// Playlist routes
// ALL /playlist/byTrack/PROVIDER/TRACK_ID
app.use('/playlist/byTrack/:provider/:trackId', rest({entity: 'playlist', action: 'byTrack'}));

// Defaults
// ALL /ENTITY/ID/ACTION
app.use('/:' + c.entityParamName + '/:' + c.idParamName + '/:' + c.actionParamName, rest(null, [converters.idConverter]));
// ALL ENTITY/ID|ACTION
app.use('/:' + c.entityParamName + '/:' + c.idParamName + '?', rest(null, [converters.idConverter, converters.ownerConverter]));


/**
 * Error handling
 * If a request was not handled by any other middleware before,
 * there must be an error..
 */

app.use(app.oauth.errorHandler());

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
    err = err || error.notFound();
    next(err);
});

// Final error handler.
// Returns an JSONfied error object to the client.
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status,
            message: err.message,
            stack: app.get('env') === 'development' ? err.stack: undefined,
            validation: err.validationErros
        }
    });
});


module.exports = app;
