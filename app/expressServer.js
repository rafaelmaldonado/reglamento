var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var compress = require('compression');
var sm = require('sitemap');
var home = require('./controllers/home');
var article = require('./controllers/article');
var search = require('./controllers/search');
var error = require('./controllers/error');
var logger = require('../utils/logger.js');
var urlslist = require('../utils/urlslist');

module.exports =  ExpressServer = function(config){
    config = config || {};
    this.expressServer = express(), sitemap = sm.createSitemap ({
        hostname: 'http://www.reglamentotransitodf.mx',
        cacheTime: 600000,
        urls: urlslist
    });
    this.expressServer.use(compress());
    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/views');
    this.expressServer.use(bodyParser.json());
    this.expressServer.use(bodyParser.urlencoded({
        extended: true
    }));
    this.expressServer.use(morgan('combined', {stream: logger.stream}));
    this.expressServer.use(express.static('static', { maxAge: 86400000 }));
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
    this.expressServer.get('/google083d2b55760cc10e.html', function (req, res){
        res.send('google-site-verification: google083d2b55760cc10e.html');
    });
    this.expressServer.get('/sitemap.xml', function (req, res){
        sitemap.toXML( function (err, xml) {
            if (err) {
                return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
     });
    this.expressServer.get('*', function (req, res){
        error(req, res);
    });
};