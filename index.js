fs = require('fs');

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
	var article_words = [];
	for (var i in files){
		console.log('processing file [' + files[i] + ']');
		article_words.push(getArticleWords(path + files[i]));
	}
	//console.log(article_words);
	console.log('all articles loaded')
	var total_words = [];
	for (group in article_words)
		for (word in article_words[group])
			total_words.push(article_words[group][word]);
	//console.log(total_words);
	console.log('total words: ' + total_words.length);
	var filtered_words = [''];
	console.log('start filtering words...');
	for (var i in total_words){
		for (var j = 0; j < total_words.length; j++){
			if (total_words[j] == filtered_words[i]){
				break;
			} else {
				filtered_words.push(total_words[j]);
				break;
			}
		}
	}
//	console.log(filtered_words);
	console.log('final count of words: ' + filtered_words.length);
}

function getArticleWords(article_file){
//	console.log(article_file)
	var contents = fs.readFileSync(article_file, 'UTF-8');
	var result = contents.split(/[\r|\n|.|,|\s|:|;|/]/);
	var pattern = new RegExp(['^\s*$|\\blas\\b|\\blos\\b|\\bel\\b|\\bla\\b|\\by\\b|\\ba\\b|\\bante\\b|\\bbajo\\b|\\bcon\\b',
		'|\\bde\\b|\\bdesde\\b|\\ben\\b|\\bpara\\b|\\bpor\\b|\\bsalvo\\b|\\bsegún\\b|\\bsin\\b|\\btras\\b|\\bo\\b|\\bde\\b',
		'|\\bdel\\b|\\bsu\\b|\\bsus\\b|\\bque\\b|\\bse\\b|\\blo\\b|\\bcomo\\b|\\basí\\b|\\bson\\b|\\btiene\\b|\\beste\\b',
		'|\\bestos\\b|\\bun\\b|\\buna\\b|\\bunos\\b|\\bunas\\b|^-*$|\\bal\\b|\\be\\b|\\bes\\b|\\bsea\\b|\\bsean\\b|\\bu\\b',
		'|\\basí\\b|\\bésta\\b|\\béstas\\b|\\ble\\b'].join(''));
	var words = [];
	var count = 0;

	for (var i in result){
	//	console.log(i + ' ' + result[i]);
		result[i] = String.prototype.toLowerCase.call(result[i]);
		if (!pattern.test(result[i])){
			words.push(result[i]);
			//console.log(count + ': ' + result[i]);
			count++;
		} else if (pattern.exec(result[i]) != result[i]){
			words.push(result[i]);
			//console.log(count + ': ' + result[i]);
			count++;
		} else {
	//		console.log('[ ' + result[i] + ' ]');
		}
	}

	console.log("words in file: " + count);
	//console.log(pattern);
	return words;
}