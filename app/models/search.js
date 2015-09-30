var mysql = require('mysql');
var dbconf = require('../../config/db');
var pool = mysql.createPool({
	host: dbconf.host,
	user: dbconf.user,
	password: dbconf.pass,
	database: dbconf.base,
	multipleStatements: true
});
module.exports = function(words, offset, callback){
	pool.getConnection(function(err, connection){
		if (err){
			connection.release();
			throw err;
		}
		var words_select = '(';
		for (i in words){
			if ((/[0-9]+/).test(words[i])){
				words_select += 'a.id = ' + words[i] + ' OR ';
				words_select += 'p.palabra = \'' + words[i] + '\'';
			} else
				words_select += 'p.palabra = \'' + words[i] + '\'';
			if (i < words.length - 1)
				words_select += ' OR ';
		}
		words_select += ')';
		var query = 'SELECT a.id AS id, IF (COUNT(ap.id) > 1, COUNT(ap.id) * 10 + SUM(ap.incidencias), SUM(ap.incidencias)) AS points, a.texto as text FROM articulo a, articulo_palabra ap, palabra p WHERE a.id = ap.id_articulo AND ap.id_palabra = p.id AND ' + words_select + ' GROUP BY id ORDER BY points DESC LIMIT 6 OFFSET ' + offset + ';';
		connection.query(query, function(err, rows){
			connection.release();
			if (err)
				throw err;
			callback(rows);
		});
	});
}