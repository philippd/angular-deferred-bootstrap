var express = require('express');

var app = express();
var server = require('http').createServer(app),
  url = require('url'),
  fs = require('fs');

var getDemoConfig = function (req, res) {
  function answer(code, data) {
    res.writeHead(code,{
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Headers':'X-Requested-With'
    });
    res.end(data);
  }

  fs.readFile('./demo/demo.config.json', function(err, data) {
    if (err) answer(404, '');
    else answer(200, data);
  });
};

app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.errorHandler());
  app.use(express.static(__dirname));
  app.use(app.router);

  app.get('/api/demo-config', getDemoConfig);
  app.get('/api/demo-config-2', getDemoConfig);
});

module.exports = server;

// Override: Provide an "use" used by grunt-express.
module.exports.use = function () {
  app.use.apply(app, arguments);
};