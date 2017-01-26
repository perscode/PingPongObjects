/*jshint node:true*/
'use strict';
//
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var cors = require('cors');
var logger = require('morgan');
var port = process.env.PORT || 3000;
var errorHandler = require('./routes/utils/errorHandler')();
var environment = process.env.NODE_ENV;
var apiRouter = require('./routes/api/index');
var adventofcode = require('./routes/routes');
//var authRouter = require('./routes/auth/index');
var token = "";

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors()); 
app.use(errorHandler.init);

app.use('/api', apiRouter);
app.use('/aoc', adventofcode);
//app.use('/auth', authRouter);


console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
    //console.log(req.body);
    res.send('pong');
});

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});