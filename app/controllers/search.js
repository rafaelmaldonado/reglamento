var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	var words_user = [];
	var offset;
	var page;
	var pattern = new RegExp(['^\s*$|\\blas\\b|\\blos\\b|\\bel\\b|\\bla\\b|\\by\\b|\\ba\\b|\\bante\\b|\\bbajo\\b|\\bcon\\b',
        '|\\bde\\b|\\bdesde\\b|\\ben\\b|\\bpara\\b|\\bpor\\b|\\bsalvo\\b|\\bsegún\\b|\\bsin\\b|\\btras\\b|\\bo\\b|\\bde\\b',
        '|\\bdel\\b|\\bsu\\b|\\bsus\\b|\\bque\\b|\\bse\\b|\\blo\\b|\\bcomo\\b|\\basí\\b|\\bson\\b|\\btiene\\b|\\beste\\b',
        '|\\bestos\\b|\\bun\\b|\\buna\\b|\\bunos\\b|\\bunas\\b|^-*$|\\bal\\b|\\be\\b|\\bes\\b|\\bsea\\b|\\bsean\\b|\\bu\\b',
        '|\\basí\\b|\\bésta\\b|\\béstas\\b|\\ble\\b|\\bese\\b|\\besa\\b'].join(''));
	if (req.query.p)
		page = req.query.p;
	else
		page = 0;
	offset = page * 5;
	if (req.query.q && (req.query.q).length > 0){
		words_user = (req.query.q).split(' ');
		for (var i in words_user)
			if (!pattern.test(words_user[i]))
				words.push(words_user[i]);
			else if (pattern.exec(words_user[i]) != words_user[i])
				words.push(words_user[i]);
		if (words.length < 1)
			words = ['error'];
	} else
		words = ['error'];
	model(words, offset, function(callback){
		var result = [];
		for (var element in callback){
			if (element < 5){
				filtered = (callback[element].text).split(/[\r|\n|\s]/);
				var resume = [];
				var positions = [];
				for (var i in words){
					for (var j = 0; j < filtered.length; j++){
						var re = new RegExp(normalize(words[i]), 'i');
						if (re.test(normalize(filtered[j]))){
							filtered[j] = '<b>' + filtered[j] + '</b>';
							positions.push({position: j, word: words[i]});
						}
					}
				}
				positions = orderPositions(positions);
				positions = findShortestDistance(positions);
				positions = getReducedResume(positions);
				for (var i = 0; i < positions.length; i++){
					var init = 0, end = 0;
					var more_text = false;
					if (positions[i].position - 10 > 0){
						init = positions[i].position - 10;
						if (resume[resume.length - 1] != '...')
							resume.push('...');
					} else
						init = 2;
					if (positions[i].position + 10 < filtered.length){
						more_text = true;
						end = positions[i].position + 10;
					} else
						end = filtered.length;
					while (init < end){
						resume.push(filtered[init]);
						init++;
					}
					if (more_text)
						resume.push('...');
					result[element] = {text: resume.join(' '), id: callback[element].id};
				}
			}
		}
		if (callback.length == 0)
			res.render('../views/search', {empty: 'No hay resultados para tu búsqueda'});
		else {
			if (callback.length > 5){
				page++;
				res.render('../views/search', {list: result, next: page, query: req.query.q});
			} else
				res.render('../views/search', {list: result});
		}
	});

	function normalize (text){
		var accents = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
		var replace = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
		for (var i in accents)
			text = text.replace(accents.charAt(i), replace.charAt(i));
		return text;
	}

	function findShortestDistance(a){
		var b = [];
		var again = false;
		var limit;
		if (a.length > 1){
			for (var i = 0; i < a.length; i++){
				if (i + 1 < a.length)
					limit = i + 1;
				else
					limit = a.length - 1;
				if (a[limit].position - a[i].position < 10){
					new_position = Math.floor(((a[limit].position - a[i].position) / 2) + Math.floor(a[i].position));
					b.push({position: new_position, word: a[i].word + ',' + a[limit].word});
					i++;
				} else
					b.push({position: a[i].position, word: a[i].word});
			}
			if (b.length > 1){
				for (var i = 0; i < b.length; i++){
					if (i + 1 < b.length){
						limit = i + 1;
						init = i;
					} else {
						limit = b.length - 1;
						init = i - 1;
					}
					if (b[limit].position - b[init].position < 10)
						again = true;
				}
				if (again)
					return findShortestDistance(b);
				else
					return b;
			}
			return b;
		}
		return a;
	}

	function orderPositions(a){
		var aux;
		for (var i = 0; i < a.length; i++)
			for (var j = 0; j < a.length; j++)
				if (a[i].position < a[j].position){
					aux = a[i];
					a[i] = a[j];
					a[j] = aux;
				}
		return a;
	}

	function getReducedResume(a){
		var complete;
		var words_result;
		var found_complete;
		var top_1 = [];
		var top_2 = [];
		var top_count = 0;
		var b = [];
		if (a.length > 1){
			for (var i = 0; i < a.length; i++){
				complete = 0;
				words_result = a[i].word.split(',');
				for (var j = 0; j < words.length; j++){
					found_complete = false;
					for (var k = 0; k < words_result.length; k++)
						if (words[j] == words_result[k]){
							if (!found_complete)
								complete++;
							found_complete = true;
						}
				}
				if (complete == words.length && b.length < 2)
					b.push(a[i]);
				else if(a[i].word.split(',').length > top_count){
					top_count = a[i].word.split(',').length;
					top_2 = top_1;
					top_1 = a[i];
				}
			}
			if (b.length < 2)
				b.push(top_1);
			if (b.length < 2 && top_2.length > 0)
				b.push(top_2);
			return b;
		}
		return a;
	}
}