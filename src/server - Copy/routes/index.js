var express = require('express');
var expressRouter = express.Router();
var apiRouter = require('./api/index');
var authRouter = require('./auth/index');


    expressRouter.use('/api', apiRouter);
    expressRouter.use('/auth', authRouter);


module.exports = expressRouter;