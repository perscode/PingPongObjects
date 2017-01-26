var request = require('request');

var apiService = function() {
    var sendQuery = function(options, cb) {
        var options = options;
        request(options, function(err, response, body){
            if(!err){
                cb(null, response);
            }else{
                console.log("error fetching getTotalViews: ", err);
                cb(err);
            };
        });
    };

    var getBrands = function(options, cb) {
        var options = options;
        request(options, function(err, response, body){
            if(!err){
                cb(null, response);
            }else{
                console.log("error fetching getTotalViews: ", err);
                cb(err, response);
            };
        });
    };

    var getTotalViews = function(options, cb) {
        var options = options;
        request(options, function (err, response, body){
            if(!err){
                cb(null, response);
            }else{
                console.log("error fetching getTotalViews: ", err);
                cb(err);
            };
        });
    };

    return {
        getBrands: getBrands,
        getTotalViews: getTotalViews,
        sendQuery: sendQuery
    };
};

module.exports = apiService;