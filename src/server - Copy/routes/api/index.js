var express = require('express');
var apiRouter = express.Router();
var token = "";
var fs = require('fs');
var request = require('request');
var http = require('http');
//var products = require('./products');
//var users = require('./users');
//var brands = require('./brands');
apiRouter.all('*', function(req, res, next){
    token = req.headers.Authorization;
    if(token) {
        console.log("***** THEffRE IS A TOKEN!", token," *****");
        
    }
    next(null);
});

var products = require('./products')(token);
var me = require('./me')(token);

apiRouter.use('/products', products);
apiRouter.use('/me', me);
apiRouter.get('/days/:id', getDay);

apiRouter.use('/crashme',function(req, res, next) {
    console.log("??????????????????");
    process.exit();
    next(null);
});

//////////////
function getDay(req, res, next){
    var url = "http://adventofcode.com/2016/day/"+req.params.id+"/input";
    console.log("url: ", url);
    var options = {
        headers: {
            'Cookie':'session=53616c7465645f5f8f3f7b396bb17ac4155317e41c87a7ac222751b8996d062d4415dd0f3042b7d41716ef944e0ec3ac; _ga=GA1.2.120430673.1480785411'
        },
        url: url,
        port: 80
    }
    var chunk ="";
    request(options, function(err, response, body){
        if(err){
            console.log("err: ", err);
        }
        chunk = body;
        res.send(chunk);
    });
    
} 

module.exports = apiRouter;