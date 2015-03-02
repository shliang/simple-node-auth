var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./routes/index');
var user = require('./models/user.js');
var port = process.env.PORT || '3000';

mongoose.connect(process.env["MONGODBSTRING"]);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: "super secret",
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//middleware looks up for user and sets it in req.user
app.use(function(req, res ,next) {
	console.log("session token in middleware");
	console.log(req.session.sessionToken);
	if (!req.session.sessionToken) return next();
	user.findOne({sessionToken: req.session.sessionToken}, function(err, user) {
		if (err) throw error;
		req.user = user;
		next();
	})
});

//middleware that allows us to do delete/put
app.use(function(req, res, next) {
	if (req.method == "GET") return next();
	if (req.body && req.body["_method"]) {
		req.method = req.body["_method"];
	}
	
	next();
});

app.use('/', routes); // adding anything to path just prefix the path with that name

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port);