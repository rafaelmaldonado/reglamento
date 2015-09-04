var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	words = (req.query.q).split(' ');
	model(words, function(callback){
		for (var element in callback){
			filtered = (callback[element].text).split(/[\r|\n|\s]/);
			var resume = [];
			for (var i in words){
				for (var j in filtered){
					var re = new RegExp(normalize(words[i]), 'i');
					if(re.test(normalize(filtered[j]))){
						
						var init = 0, end = 0;
						var more_text = false;
						filtered[j] = '<b>' + filtered[j] + '</b>';
						if (Math.floor(j) - 10 > 0){
							init = Math.floor(j) - 10;
							if (resume[resume.length - 1] != '...')
								resume.push('...');
						} else {
							init = 0;
						}
						if (Math.floor(j) + 10 < filtered.length){
							more_text = true;
							end = Math.floor(j) + 10;
						} else {
							end = filtered.length;
						}
						while(init < end){
							resume.push(filtered[init]);
							init++;
						}
						if (more_text)
							resume.push('...');
					}
				}
			}
			callback[element].text = resume.join(' ');
		}
		if (callback.length == 0)
			res.render('../views/search', {empty: 'No hay resultados para tu búsqueda'});
		else
			res.render('../views/search', {list: callback});
	});

	function normalize (text) {
		var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
		var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
		for (var i=0; i<acentos.length; i++)
			text = text.replace(acentos.charAt(i), original.charAt(i));
		return text;
	}
}