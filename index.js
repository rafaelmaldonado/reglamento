var express = require ('express');
var app = express();

app.get('/', function(req, res){
	res.send('Hello wordl!');
});

var server = app.listen(3000, function(){
	var host = server.address().addreess;
	var port = server.address().port;
	console.log ('Example app listening http://%s:%s', host, port);
});