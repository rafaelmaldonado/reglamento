var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	words = (req.body.search).split(' ');
	model(words, function(callback){
		if (callback.length == 0)
			res.render('../views/search', {empty: 'No hay resultados para tu búsqueda'});
		else
			res.render('../views/search', {list: callback});
	});
}