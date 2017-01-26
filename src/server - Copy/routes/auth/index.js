var express = require('express');
var auth = express.Router();
var OidcClient;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var oidcConfig = ""; 
init();
    
    function init(/*_app_*/){
        oidcConfig = {
            authority: 'https://localhost:44302', //'--insert-your-openid-provider-domain-name-here--',
            client_id: 'AnalyticsProAngularClient',
            redirect_uri: 'http://localhost:50000/auth/callback/', // callback url, can be absolute or relative
            post_logout_redirect_uri: 'localhost:50000/',
            scope: 'openid analytics_api profile',
            response_type: "id_token token",
            response_mode: "form_post",
            verbose_logging: true
        };
        //app = _app_;
        OidcClient = require('oidc-client-node');
        configureRoutes();
    }

    function configureRoutes(){
        auth.get('/getToken', getToken);
        auth.post('/callback/', testCallback);
        auth.get('/test/', function(req, res, next){
            res.send("ok");
        });
    }

    function getToken(req, res){
        console.log("----------------------------------");
        console.log("------- Request: getToken- -------");
        //console.log("req.url: ", req.url);
        console.log("----------------------------------");
        
        var oidcClient = new OidcClient(req, res, oidcConfig);

        var tokenRequest = oidcClient.createTokenRequestAsync();

        tokenRequest.then(function (results) {
            console.log('about to redirect', results);
            res.send(results.url);
            //res.redirect('/auth/signin?' + results.url);  
        }).catch(function(error){
            console.log('error generating redirect url: ' + error);
        });
    }

    function testCallback(req, res){
        console.log("----------------------------------");
        console.log("------- Request: testCallback- -------");
        console.log("req.url: ", req.url);
        console.log("----------------------------------");        
        //req.body = req.body.hash;
        console.log("HELLO, REQ.body IS: ", req.body);
        var oidcClient = new OidcClient(req, res, oidcConfig);
        
        var tokenResponse = oidcClient.processResponseAsync(req.body);
        
        tokenResponse.then(function (results) {
            console.log(results);
            res.redirect("/auth/token?access_token=" + results.access_token );
        }).catch(function(error) {
            console.log('error parsing token response: ' + error);
        });

        console.log('Made it to the end of the response function');
    }

module.exports = auth;
