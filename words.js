var fs = require('fs');
var mysql = require('mysql');

var path = './articles/';
var files = fs.readdirSync(path);

//there are two main processes
//First insert every different word to Palabra on DB
//Second insert words into articulo_palabra per article

//first process
insertPalabras();

//second process
//insertRelation();

function insertPalabras(){
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'safe',
		database: 'reglamento',
		multipleStatements: true
	});

	var article_words = [];
	for (var i in files)
		article_words.push(getArticleWords(path + files[i]));

	var total_words = [];
	for (group in article_words)
		for (word in article_words[group])
			total_words.push(article_words[group][word]);

	var filtered_words = [];
	var is_new = false;
	for (var i in total_words){
		for (var j in total_words)
			if (i != j)
				if (total_words[i] == total_words[j]){
					is_new = false;
					break;
				}
				else
					is_new = true;
			else
				if (total_words[i] == total_words[j]){
					is_new = true;
					break;
				}
				else
					is_new = false;
		if (is_new){
			filtered_words.push(total_words[i]);
		}
	}
	connection.connect();
	var queries = '';
	for(i in filtered_words)
		queries += 'INSERT INTO palabra(palabra) VALUES(\''+ filtered_words[i] + '\'); ';
	connection.query(queries, function (err, rows){
		if (err)
			throw err;
	});
	connection.end(function(err){
		if (err)
			throw err;
		console.log('queries ended');
	});
}

function getArticleWords(article_file){
//	console.log(article_file)
	var contents = fs.readFileSync(article_file, 'UTF-8');
	var result = contents.split(/[\r|\n|.|,|\s|:|;|“|/|”]/);
	var pattern = new RegExp(['^\s*$|\\blas\\b|\\blos\\b|\\bel\\b|\\bla\\b|\\by\\b|\\ba\\b|\\bante\\b|\\bbajo\\b|\\bcon\\b',
		'|\\bde\\b|\\bdesde\\b|\\ben\\b|\\bpara\\b|\\bpor\\b|\\bsalvo\\b|\\bsegún\\b|\\bsin\\b|\\btras\\b|\\bo\\b|\\bde\\b',
		'|\\bdel\\b|\\bsu\\b|\\bsus\\b|\\bque\\b|\\bse\\b|\\blo\\b|\\bcomo\\b|\\basí\\b|\\bson\\b|\\btiene\\b|\\beste\\b',
		'|\\bestos\\b|\\bun\\b|\\buna\\b|\\bunos\\b|\\bunas\\b|^-*$|\\bal\\b|\\be\\b|\\bes\\b|\\bsea\\b|\\bsean\\b|\\bu\\b',
		'|\\basí\\b|\\bésta\\b|\\béstas\\b|\\ble\\b|\\bese\\b|\\besa\\b'].join(''));
	var words = [];
//	var count = 0;

	for (var i in result){
	//	console.log(i + ' ' + result[i]);
		result[i] = String.prototype.toLowerCase.call(result[i]);
		if (!pattern.test(result[i])){
			words.push(result[i]);
			//console.log(count + ': ' + result[i]);
//			count++;
		} else if (pattern.exec(result[i]) != result[i]){
			words.push(result[i]);
			//console.log(count + ': ' + result[i]);
//			count++;
		} else {
	//		console.log('[ ' + result[i] + ' ]');
		}
	}

//	console.log("words in file: " + count);
	//console.log(pattern);
	return words;
}