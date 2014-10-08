var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var error = require('./lib/http-error');
var restRouter = require('./lib/routing/rest-routing');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Registers the API REST route and
// handles all valid API REST requests:
restRouter(app);

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
            errorObject: { err: app.get('env') === 'development'? err : undefined }
        }
    });
});


module.exports = app;
