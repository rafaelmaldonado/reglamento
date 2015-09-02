module.exports = function (req, res){
	console.log(req.body.search);
	res.send(req.body.search);
}