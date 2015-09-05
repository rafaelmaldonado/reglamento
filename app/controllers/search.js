var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	words = (req.query.q).split(' ');
	model(words, function(callback){
		for (var element in callback){
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
			}
			callback[element].text = resume.join(' ');
		}
		if (callback.length == 0)
			res.render('../views/search', {empty: 'No hay resultados para tu búsqueda'});
		else
			res.render('../views/search', {list: callback});
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

}