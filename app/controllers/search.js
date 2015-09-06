var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	var offset;
	var page;
	if (req.query.p)
		page = req.query.p;
	else
		page = 0;
	offset = page * 5;
	words = (req.query.q).split(' ');
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
							positions.push(j);
						}
					}
				}
				positions = orderPositions(positions);
				positions = findShortestDistance(positions);
				for (var i = 0; i < positions.length; i++){
					var init = 0, end = 0;
					var more_text = false;
					if (positions[i] - 10 > 0){
						init = positions[i] - 10;
						if (resume[resume.length - 1] != '...')
							resume.push('...');
					} else {
						init = 2;
					}
					if (positions[i] + 10 < filtered.length){
						more_text = true;
						end = positions[i] + 10;
					} else {
						end = filtered.length;
					}
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
		for (var i = 0; i < a.length; i++){
			if (a[i + 1] - a[i] < 10){
				new_position = Math.floor(((a[i + 1] - a[i]) / 2) + Math.floor(a[i]));
				b.push(new_position);
				i++;
			} else {
				b.push(a[i]);
			}
		}
		for (var i = 0; i < b.length; i++)
			if (a[i + 1] - a[i] < 10)
				again = true;
		if (again)
			return findShortestDistance(b);
		else
			return b;
	}

	function orderPositions(a){
		var aux;
		for (var i = 0; i < a.length; i++){
			for (var j = 0; j < a.length; j++){
				if (a[i] < a[j]){
					aux = a[i];
					a[i] = a[j];
					a[j] = aux;
				}
			}
		}
		return a;
	}

}