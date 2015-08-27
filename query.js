var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'safe',
	database: 'reglamento'
});

connection.connect();
connection.query('SELECT texto FROM articulo', function (err, rows, fields){
	if (err)
		throw err;
	for (i in rows)
		console.log(rows[i].texto);
})
connection.end()