var router = require('express').Router();
var four0four = require('../utils/404')();
var qs = require('./utils/queryservice')();
var db = require('../lib/accessDB');
var util = require('util');
var _ = require('lodash/core');

//router.get('/fix', fix);
router.get('/players', getPlayers);
router.get('/players/:id', getPlayer);
router.get('/players/:id/pos', getPlayerPos);
router.get('/matches', getMatches);
router.post('/players', addPlayer);
router.post('/players/:id/quote', addQuote);
router.post('/players/:id/nickname', addNickname);
router.post('/matches', addMatch);
router.get('/elo', getEloOutcome);
router.get('/wipeallstats', wipeallstats);
router.get('/*', four0four.notFoundMiddleware);
 

module.exports = router;

function getPlayers(req, res, next) {
    console.log("attempting to fetch players.");
    db.getPlayerSummary(function (err, data) {
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            res.status(200).json(data);
        }
    });    
}

function wipeallstats(req, res, next){
    db.fullwipe(function (err, data) {
        if (err) {
            console.log('*** wipeallstats err');
            res.json({
                err: err
            });
        } else {
            res.json(data);
        }
    });
}

function addQuote(req, res, next){
    var query = {
        id: req.params.id,
        quote: req.body.quote
    };
    db.addPlayerQuote(query, function (err, data) {
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });   
}
function addNickname(req, res, next){
    var query = {
        id: req.params.id,
        nickname: req.body.nickname
    };
    db.addPlayerNickname(query, function (err, data) {
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });
}
function getEloOutcome(req, res, next){
    var query = req.query;
    db.eloOutcome(query, function (err, data) {
        
        if (err) {
            console.log('*** players err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });    
}
function getMatches(req, res, next){
    db.getMatchSummary(function(err, data){
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    }); 
}
function getPlayer(req, res, next){
    var id = req.params.id;
    console.log("routes: query: ", id);
    db.getPlayer(id, function (err, data) {
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });    
}
function getPlayerPos(req, res, next){
    var id = req.params.id;
    console.log("routes: query: ", id);
    db.getPlayerPos(id, function (err, data) {
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });     
}
function addPlayer(req, res, next){
    var query = req.body;
    console.log("query: ", query);
    db.addPlayer(query, function (err, data) {
        if (err) {
            console.log('*** palyers err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });    
}
function addMatch(req, res, next){
    var ip = require("ip");
    var query = req.body;
    query.ip = ip.address();
    db.addMatchResults(query, function (err, data) {
        if (err) {
            console.log('*** addmatch err');
            res.json({
                err: err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json(data);
        }
    });    
}
function addProperties(req, res, next){
    var file = req.query.filename ? req.query.filename : null; 
    db.rebase(file, function (err, data) {
        if (err) {
            console.log('*** products err');
            res.json({
                "msg": "error: " + err
            });
        } else {
            //console.log('*** products ok', data.products);
            res.json({"msg": "ok"});
        }
    });
}

function getPeople(req, res, next) {
  res.status(200).send(data.people); 
}

function getPerson(req, res, next) { 
  var id = +req.params.id;
  var person = data.people.filter(function(p) {
    return p.id === id;
  })[0];
 
  if (person) {
    res.status(200).send(person);
  } else {
    four0four.send404(req, res, 'person ' + id + ' not found');
  } 
}

