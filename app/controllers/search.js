var model = require('../models/search.js');
module.exports = function (req, res){
	var words = [];
	var list;
	words = (req.body.search).split(' ');
	model(words, function(callback){
		if (callback.length == 0)
			res.render('../views/list', {empty: 'No hay resultados para tu búsqueda'});
		else
			res.render('../views/list', {list: callback});
	});
}