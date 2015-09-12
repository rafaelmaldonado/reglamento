var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var home = require('./controllers/home');
var article = require('./controllers/article');
var search = require('./controllers/search');
var error = require('./controllers/error');
var logger = require('../utils/logger.js');

module.exports =  ExpressServer = function(config){
    config = config || {};
    this.expressServer = express();
    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/views');
    this.expressServer.use(bodyParser.json());
    this.expressServer.use(bodyParser.urlencoded({
        extended: true
    }));
    this.expressServer.use(morgan('combined', {stream: logger.stream}));
    swig.setDefaults({varControls:['[[',']]']});
    if(config.mode == 'development'){
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls:['[[',']]']});
    }
    this.expressServer.get('/', function (req, res){
        home(req, res);
    });
    this.expressServer.get('/search', function (req, res){
        search(req, res);
    });
    this.expressServer.get('/article/:article', function (req, res){
        article(req, res);
    });
    this.expressServer.get('*', function (req, res){
        error(req, res);
    });
};