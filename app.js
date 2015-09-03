var config = require ('./config')();
var http = require ('http');
var expressServer = require ('./app/expressServer');

var app = new expressServer();

var server = http.createServer(app.expressServer);
server.listen(config.port, function(){
	console.log('Regulation searcher running on ' + config.port);
});