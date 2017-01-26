var express = require('express');
var brandsEndpoint = express.Router();
var request = require('request');
var url = 'https://localhost:44300/api/v2/brands/';
var options = initOptions;

brandsEndpoint.route('/:id')
    .get(function(req, res){
        options.headers.authorization = req.headers.authorization;
        options.uri += +req.params.id;

        function callback(err, response, body){
            var body = JSON.parse(response.body);
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            res.send(body); 
        }

        request(options, callback);
    });

    function initOptions () {
        return {
            "rejectUnauthorized": false, 
            uri: url,
            method: 'GET',
            headers: {
                'authorization': "",
                'accept': 'application/json'
            }
        };
    }
module.exports = brandsEndpoint;

