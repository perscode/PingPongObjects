module.exports = function(token) {
    var token = token;
    var express = require('express');
    var meEndpoint = express.Router();
    var apiService = require('../../services/apiService')();
    var meController = require('../../controllers/meController')(apiService);

    meEndpoint.use(function (req, res, next){
        console.log("if !token res.redirect('/toSomething')");
        console.log("token is: ", token);
        next();
    });

    meEndpoint.route('/brands')
        .get(meController.getBrands);

    meEndpoint.route('/views_total')
        .get(meController.getViewsCount);

    meEndpoint.route('/downloads_total')
        .get(meController.getDownloadsTotal);

    meEndpoint.route('/usersTotal')
        .get(meController.getUsersTotal);

    meEndpoint.route('/downloadsPerDay')
        .get(meController.getDownloadsPerDay);

    meEndpoint.route('/products')
        .get(meController.getProducts);

    meEndpoint.route('/downloads')
        .get(meController.getDownloads);

    meEndpoint.route('/countries')
        .get(meController.getCountries);

    meEndpoint.route('/countries/?id/cities')
        .get(meController.getCities);
               
    meEndpoint.route('/test')
        .get(function(req, res){
            console.log("test");
            return res.json({"data": "/test route OK"});
        });

    return meEndpoint;
};

