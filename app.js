var PORT = 8000;
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
require('./controllers/auth.js')(app);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).send('404 :(((');
});


app.set('port', process.env.PORT || PORT);
var server = http.createServer(app);
server.listen(PORT, function() {
	console.log('Listening on port ' + PORT);
});
