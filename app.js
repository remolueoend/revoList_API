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

app.all('/oauth/token', app.oauth.grant());
app.all('*', app.oauth.authorise());

app.use(require('./lib/actionQuery')());


/**
 * REST route definitions
 */
// Playlist
app.use('/playlist/byTrack/:provider/:trackId', rest({entity: 'playlist', action: 'byTrack'}));
//app.use('/playlist/:id/addTrack', rest({entity: 'playlist', action: 'addTrack'}));
//app.use('playlist/:id/removeTrack', rest({entity: 'playlist', action: 'removeTrack'}));
//app.use('/playlist?', rest({entity: 'playlist'}, [converters.ownerConverter]));

// Defaults
app.use('/:' + c.entityParamName + '/:' + c.idParamName + '/:' + c.actionParamName, rest());
app.use('/:' + c.entityParamName + '/:' + c.idParamName + '?', rest(null, [converters.idConverter, converters.ownerConverter]));





app.use(app.oauth.errorHandler());

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
    err = err || error.notFound();
    next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
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
