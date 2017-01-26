var meController = function(service){
    var apiService = service;

    function getBrands(req, res) { 
        console.log("***** getBrands *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.getBrands(options, function(err, response){
            if(response.statusCode == 401){
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                return res.sendStatus(401, response.body);
            }
            var body = "";
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });
 
    };

    function getViewsCount(req, res){
        console.log("***** getViewsTotal *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.getTotalViews(options, function(err, response){
            if(response.statusCode == 401){
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                return res.sendStatus(401, response.body);
            }else{
                console.log("?????????????????????????????????????");
                console.log("status: ", response.statusCode);
            }
            var body = "";
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
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                return res.sendStatus(401, response.body);
            }
            var body = "";
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });        
    };

    function getUsersTotal(req, res) {
        console.log("***** getUsersTotal *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body = "";
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
            var body = "";
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });  
    }

    function getDownloadsPerDay(req, res){
        console.log("***** getDownloadsPerDay *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body = "";
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });  
    };

    function getProducts(req, res) {
        console.log("***** getProducts *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body = "";
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });  
    };

    function getCountries(req, res) {
        console.log("***** getCountries *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body = "";
            try {
                body = JSON.parse(response.body);
            } catch(err) {
                console.log("error parsing body: ", err);
            }
            res.send(body);            
        });
    };

    function getCities(req, res) {
        console.log("***** getCities *****");
        var url = "" + req.url;
        var token = req.headers.authorization; 
        var options = initOptions(url, token);
        apiService.sendQuery(options, function(err, response){
            if(response.statusCode == 401){
                return res.sendStatus(401, response.body);
            }
            var body = "";
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
            uri: 'https://localhost:44300/api/v2/me' + uri,
            method: 'GET',
            headers: {
                'authorization': token,
                'accept': 'application/json'
            }
        };
    };

    return {
        getViewsCount: getViewsCount,
        getBrands: getBrands,
        getDownloadsTotal: getDownloadsTotal,
        getUsersTotal: getUsersTotal,
        getDownloads: getDownloads,
        getDownloadsPerDay: getDownloadsPerDay,
        getProducts: getProducts,
        getCountries: getCountries,
        getCities: getCities 
    };
};

module.exports = meController;