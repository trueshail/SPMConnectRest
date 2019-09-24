var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/web/users');
var items = require('./routes/web/items');

var users_api = require('./routes/api/users_api');
var items_api = require('./routes/api/items_api');
var jobs_api = require('./routes/api/jobs_api');
var wo_api = require('./routes/api/workorder_api');
var pr_api = require('./routes/api/purchasereqs_api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/items', items);

app.use('/api/items', items_api);
app.use('/api/jobs', jobs_api);
app.use('/api/wo', wo_api);
app.use('/api/pr', pr_api);
app.use('/api/users', users_api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', {
		route: 'error'
	});
});

module.exports = app;
