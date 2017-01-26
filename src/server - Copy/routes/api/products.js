module.exports = function(token) {
    var token = token;
    var express = require('express');
    var productEndpoint = express.Router();
    var apiService = require('../../services/apiService')();
    var productController = require('../../controllers/productController')(apiService);

    productEndpoint.use(function (req, res, next){
        console.log("if !token res.redirect('/toSomething')");
        console.log("token is: ", token);
        console.log("PATH IS: ", req.url);
        next();
    }); 

    productEndpoint.route('/:id')
        .get(productController.getProduct);

    productEndpoint.route('/:id/views_total')
        .get(productController.getViewsCount);

    productEndpoint.route('/:id/downloads_total')
        .get(productController.getDownloadsTotal);

    productEndpoint.route('/:id/downloadsPerDay')
        .get(productController.getDownloadsPerDay);

    productEndpoint.route('/:id/downloads')
        .get(productController.getDownloads);

    productEndpoint.route('/test')
        .get(function(req, res){
            console.log("test");
            return res.json({"data": "/test route OK"});
        });

    return productEndpoint;
};