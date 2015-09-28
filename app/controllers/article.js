var fs = require('fs');
var path = require('path');

module.exports = function (req, res){
	var page = req.params.article;
	var id;
	page = page.split(/\.|\-/);
	for (var i in page)
		if ((/^\d+$/).test(page[i]))
			id = page[i];
	if (id && id > 0 && id < 71){
		var content = fs.readFileSync(path.dirname(require.main.filename) + '/app/views/art_' + id + '.html', 'utf8');
		res.render('../views/article', {text: content});
	} else
		res.render('../views/error');
}