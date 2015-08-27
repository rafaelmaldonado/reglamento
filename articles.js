var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'safe',
	database: 'reglamento',
	multipleStatements: true
});

connection.connect();
var path = './articles/';
var files = fs.readdirSync(path);
var queries = '';
for (file in files){
	var article = fs.readFileSync(path + files[file], 'UTF-8');
	var temp = files[file].split('.');
	temp = temp[0].split('_');
	var id = temp[1];
	console.log(id);
	queries += 'INSERT INTO articulo(id, texto) VALUES(' + id + ',\'' + article + '\'); ';
}
connection.query(queries, function (err, rows){
	if (err)
		throw err;
});
connection.end(function(err){
	if (err)
		throw err;
	console.log('queries ended');
});