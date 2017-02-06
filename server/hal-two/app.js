var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var _ = require('underscore');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api', api);

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
  res.render('error');
});

var net = require('net');
var state = require('./services/StateService');

var client = new net.Socket();

client.connect(2001, '192.168.254.254', function() {
	console.log('Connected');
	//client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	//console.log('Received: ' + data);
});

client.on('close', function() {
	console.log('Connection closed');
});

state.onStateChange(function(e, data){
	var devices = state.getDevices();
  	
  	_.each(devices, function(device){
  		var value = 0;
  		if(device.relay_one) value ++;
  		if(device.relay_two) value += 2;

  		var command = "t00180" + device.id.toString() + "0000000000000" + value.toString() + "\r";
  		client.write(command);
  	})
});


module.exports = app;
