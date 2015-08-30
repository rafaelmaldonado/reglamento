var mysql = require ('mysql');

var pool = mysql.createPool({
	host: 'localhost',
	password: 'b166er',
	user: 'root',
	database: 'reglamento',
	multipleStatements: true
});

function startQuerying(i){
	pool.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		connection.query('SELECT * FROM articulo WHERE id = ?', i, function(err, rows){
			connection.release();
			if (err)
				throw err;
			processWordsFromArticle(rows[0]);
		});
	});
}

for (var i = 1; i <= 70; i++)
	startQuerying(i);

function processWordsFromArticle(article){
	var result = article['texto'].split(/[\r|\n|.|,|\s|:|;|“|/|”]/);
	var pattern = new RegExp(['^\s*$|\\blas\\b|\\blos\\b|\\bel\\b|\\bla\\b|\\by\\b|\\ba\\b|\\bante\\b|\\bbajo\\b|\\bcon\\b',
		'|\\bde\\b|\\bdesde\\b|\\ben\\b|\\bpara\\b|\\bpor\\b|\\bsalvo\\b|\\bsegún\\b|\\bsin\\b|\\btras\\b|\\bo\\b|\\bde\\b',
		'|\\bdel\\b|\\bsu\\b|\\bsus\\b|\\bque\\b|\\bse\\b|\\blo\\b|\\bcomo\\b|\\basí\\b|\\bson\\b|\\btiene\\b|\\beste\\b',
		'|\\bestos\\b|\\bun\\b|\\buna\\b|\\bunos\\b|\\bunas\\b|^-*$|\\bal\\b|\\be\\b|\\bes\\b|\\bsea\\b|\\bsean\\b|\\bu\\b',
		'|\\basí\\b|\\bésta\\b|\\béstas\\b|\\ble\\b|\\bese\\b|\\besa\\b'].join(''));
	var words = [];

	for (var i in result){
		result[i] = String.prototype.toLowerCase.call(result[i]);
		if (!pattern.test(result[i]))
			words.push(result[i]);
		else if (pattern.exec(result[i]) != result[i])
			words.push(result[i]);
		else {
		}
	}

	var words_counted = [];
	var is_new;
	for (i in words){
		is_new = true;
		for (j in words)
			if (i != j)
				if (words[i] == words[j])
					is_new = false;
		if (is_new)
			words_counted.push({ word: words[i], incidents: 1});
		else{
			is_new = true;
			for (count in words_counted)
				if (words_counted[count].word == words[i]){
					words_counted[count].incidents += 1;
					is_new = false;
				}
			if (is_new)
				words_counted.push({ word: words[i], incidents: 1});
		}
	}

	for (i in words_counted)
		getWordsIds(article['id'], words_counted[i]);
}

function getWordsIds(article_id, words_counted){
	pool.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		connection.query('SELECT id FROM palabra WHERE palabra = ?', words_counted.word, function(err, rows){
			connection.release();
			if (err)
				throw err;
			insertWordsArticle(article_id, rows[0].id, words_counted.incidents);
		});
	});
}

function insertWordsArticle(article_id, word_id, incidents){
	pool.getConnection(function(err, connection){
		if(err){
			connection.release();
			throw err;
		}
		var stmt = 'INSERT INTO articulo_palabra(id_articulo, id_palabra, incidencias) VALUES(' + article_id + ',' + word_id + ', ' + incidents + ');';
		connection.query(stmt, function(err, rows){
			connection.release();
			if (err)
				throw err;
			console.log('1 ROW INSERTED');
		});
	});
}