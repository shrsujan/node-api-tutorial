var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var apis = require('./routes');
var log = require('winston-logger-setup');
var router = express.Router();
var port = 8000;

var app = express();

app.use(express.static(path.join(__dirname, 'public/styles/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use('/', router);

router.get('/', function (req, res) {
  res.render('index', {title: 'Google Pixel 2'});
});

app.use('/api', apis);

var server = http.createServer(app);

server.listen(port);

server.on('listening', function () {
  log.cnsl('Server running on port ' + port);
});

server.on('error', function (error) {
  log.cnsl('Server may already be running in the designated port');
  process.exit(1);
});