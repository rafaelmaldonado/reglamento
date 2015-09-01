var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var router = require('./website/router');

var ExpressServer = function(config){
    config = config || {};

    this.expressServer = express();

    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/website/views/templates');
    swig.setDefaults({varControls:['[[',']]']});

    if(config.mode == 'development'){
        console.log('no cache');
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls:['[[',']]']});
    }

    for (var controller in router){
        for (var funcionalidad in router[controller].prototype){
            var method = funcionalidad.split('_')[0];
            var entorno = funcionalidad.split('_')[1];
            var data = funcionalidad.split('_')[2];
            data = (method == 'get' && data !== undefined) ? ':data' : '';
            var url = '/' + controller + '/' + entorno + '/' + data;
            this.router(controller,funcionalidad,method,url);
        }
    }

    this.expressServer.get('/', function (req, res){
        res.send('hacked');
    })
};
ExpressServer.prototype.router = function(controller,funcionalidad,method,url){
    console.log(url);
    this.expressServer[method](url, function(req,res,next){
       var conf = {
           'funcionalidad':funcionalidad,
           'req': req,
           'res': res,
           'next': next
       } 
       var Controller = new router[controller](conf);
       Controller.response();
    });
}
module.exports = ExpressServer;