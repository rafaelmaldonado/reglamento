var config = require ('./config')();
var http = require ('http');
var expressServer = require ('./app/expressServer');

var app = new expressServer(config);

var server = http.createServer(app.expressServer);
server.listen(config.port, function(){
	console.log('app running on port: ' + config.port);
});