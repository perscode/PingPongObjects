var productController = function(service){
    var apiService = service;

    function getViewsCount(req, res){
        console.log("***** getViewsTotal *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.getTotalViews(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body;
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);                    
        });
    };

    function getDownloadsTotal(req, res) {
        console.log("***** getDownloadsTotal *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body;
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });        
    };


    function getDownloads(req, res){
        console.log("***** getDownloads *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body;
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });  
    };

    function getDownloadsPerDay(req, res){
        console.log("***** getDownloadsPerDay *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body;
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });  
    };

    function getProduct(req, res) {
        console.log("***** getProducts *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body;
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });  
    };

    function initOptions (uri, token) {
        return {
            "rejectUnauthorized": false, 
            uri: 'https://localhost:44300/api/v2/products' + uri,
            method: 'GET',
            headers: {
                'authorization': token,
                'accept': 'application/json'
            }
        };
    };

    return {
        getViewsCount: getViewsCount,
        getDownloadsTotal: getDownloadsTotal,
        getDownloads: getDownloads,
        getDownloadsPerDay: getDownloadsPerDay,
        getProduct: getProduct
    };
};

module.exports = productController;