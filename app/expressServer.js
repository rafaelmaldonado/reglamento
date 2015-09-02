var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var home = require('./controllers/home');
var list = require('./controllers/list');
var article = require('./controllers/article');
var search = require('./controllers/search');

var ExpressServer = function(config){
    config = config || {};

    this.expressServer = express();

    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/views');
    this.expressServer.use(bodyParser.json());
    this.expressServer.use(bodyParser.urlencoded({
        extended: true
    }));
    swig.setDefaults({varControls:['[[',']]']});

    if(config.mode == 'development'){
        console.log('no cache');
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls:['[[',']]']});
    }

    this.expressServer.get('/', function (req, res){
        home(req, res);
    });

    this.expressServer.post('/search', function (req, res){
        search(req, res);
    });
};

module.exports = ExpressServer;