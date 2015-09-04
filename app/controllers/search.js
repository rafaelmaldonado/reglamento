var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	words = (req.query.q).split(' ');
	model(words, function(callback){
		for (var element in callback){
			filtered = (callback[element].text).split(' ');
			for (var i in words)
				for (var j in filtered){
					var re = new RegExp(words[i], 'i');
					if(re.test(normalize(filtered[j])))
						filtered[j] = '<b>' + filtered[j] + '</b>';
				}
			callback[element].text = filtered.join(' ');
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