// Module dependencies
var util = require('util'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    State = require('../models/state'),
    dbConfig = require('./configLoader').databaseConfig,
    data = '/../json/',
    connectionString = 'mongodb://' + dbConfig.host + '/' + dbConfig.database,
    _ = require('lodash'),
    connection = null;
var Player = require('../models/player');
var Match = require('../models/matches');
var set = require('lodash.set');
var uniq = require('lodash.uniq');
var Promise = require('bluebird');
var Elo = require('arpad');
var findindex = require('lodash.findindex')
//var isMatch = require('lodash.isMatch');
// connect to database
module.exports = {
    // Define class variable
    myEventID: null,

    // initialize DB
    startup: function (callback) {
        mongoose.connect(connectionString);
        connection = mongoose.connection;
        mongoose.Promise = global.Promise;
        mongoose.connection.on('open', function () {
            console.log('We have connected to mongodb');
            callback();
        });

    },

    // disconnect from database
    close: function () {
        connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    },
    getPlayer: function(id, callback){
        console.log("getPlayer id: ", id);
        Player.findOne({_id: id}, function(err, player){
            if(err){
                return callback(err);
            }
            callback(null, player);
        });
    },
    getPlayerPos: function(id, callback){
        console.log("getPlayer id: ", id);
        Player
            .find({}, {'elo': 1})
            .sort({elo: -1})
            .exec(function(err, players){
                if(err){
                    return callback(err);
                }
                var arr = JSON.parse(JSON.stringify(players));
                var index = findindex(arr, {_id: id});
                var playerelo = arr[index].elo;
                var sharedcount = 0;
                console.log("players: ", players);
                var pos = 0;
                
                for(var i = 0; i<arr.length; i++){
                    if(arr[i]._id.toString() === id) {
                        pos = i;
                    }
                    if(playerelo === arr[i].elo){
                        sharedcount++;
                    }
                }
                callback(null, {pos: pos, sharedby: sharedcount});
            });
    },
    getPlayerSummary: function(callback){
        Player.count(function(err, custsCount) {
            if(err){
                callback(err);
            }
            Player.find({}, { '_id': 1, 'name': 1, 'elo': 1, 'wins': 1, 'losses': 1, 'total': 1})
                .sort({elo: -1})
                .exec(function(err, res){
                    if(err){
                        callback(err);
                    }
                    console.log("err: ", err);
                    console.log("post player.find(): ", res);
                    callback(null, res);
            });
        });
    },
    getMatchSummary: function(callback){
        Match.count(function(err, matchCount) {
            if(err){
                callback(err);
            }
            Match.find({}, { '_id': 1, 'players': 1, 'winner': 1, 'date': 1})
                .sort({date: -1})
                .exec(function(err, res){
                    if(err){
                        console.log("err: ", err);
                        callback(err);
                    }
                    console.log("post player.find(): ", res);
                    callback(null, res);
            });
        });
    },
    addPlayer: function(query, callback){
        console.log("adding new player", query);
        var player = {
            name: query.name,
            elo: 1000,
            wins: 0,
            losses: 0,
            total: 0
        };
        var player = new Player(player);
        player.save(function(err, doc){
            if(err){
                console.log("err saving player: ", err);
                return callback(err);
            }
            console.log("may have worked. doc: ", doc);
            callback(null, doc);
        });
    },
    eloOutcome: function(query, callback){
        var players = query;
        var players = [];
        //var players = {p1: {}, p2: {}};
        var elo = new Elo();
        Player.find({_id: query.players[0]}).exec(function(err, res){
            var p1 = JSON.parse(JSON.stringify(res[0]));
            console.log("p1 result: ", p1);
            players[0] = p1;
        
            Player.find({_id: query.players[1]}).exec(function(err, res){
                var p2 = JSON.parse(JSON.stringify(res[0]));
                console.log("p2 result: ", p2);
                players[1] = p2;
                console.log("players: ", players);
                var response = {};
                if(players[1] && players[0] ){
                    var new_elo = {p1: elo.newRatingIfWon(players[0].elo, players[1].elo), p2: elo.newRatingIfWon(players[1].elo, players[0].elo)};
                    var elo_lost = {p1: elo.newRatingIfLost(players[0].elo, players[1].elo), p2: elo.newRatingIfLost(players[1].elo, players[0].elo)};
                    var odds_p1 = elo.expectedScore(players[0].elo, players[1].elo);
                    var odds_p2 = elo.expectedScore(players[1].elo, players[0].elo);
                    response[players[0]._id] = {old_elo: players[0].elo, if_win: new_elo.p1, odds: odds_p1, if_loose: elo_lost.p1};
                    response[players[1]._id] = {old_elo: players[1].elo, if_win: new_elo.p2, odds: odds_p2, if_loose: elo_lost.p2};
                }
                callback(null, response);
            });
        });
        
    },
    addMatchResults: function(query, callback){
        var response = {};
        var match = new Match();
        match.winner = query.won.id;
        match.regby = query.ip;
        var matchref = "";
        match.players = [{name: query.won.name, id: query.won.id}, {name: query.lost.name, id: query.lost.id}];

        match.save(function(err, match, effected){
            console.log("err: ", err, "match: ", match, "effected: ", effected);
            matchref = match._id;
            console.log("matchref: ", matchref);
        });
        Player.findOne({_id: query.won.id}, function(err, p1){
            p1.elo = query.won.win;
            p1.wins += 1;
            p1.total += 1;
            p1.matches.push(matchref);
            p1.markModified('elo');
            p1.markModified('wins');
            p1.markModified('total');
            response[p1._id] = p1;
            p1.save(function(err, player, numaffected){
                Player.findOne({_id: query.lost.id}, function(err, p2){
                    p2.elo = query.lost.loose;
                    p2.losses += 1;
                    p2.total += 1;
                    p2.matches.push(matchref);
                    p2.markModified('elo');
                    p2.markModified('losses');
                    p2.markModified('total');           
                    response[p2._id] = p2;
                    p2.save(function(err, player, numaffected){
                        callback(null, response);                        
                    });
                });
            });
        });
    },
    // insert a  customer
    insertCustomer: function (req_body, state, callback) {
        console.log('*** accessDB.insertCustomer');

        var customer = new Customer();
        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        customer.firstName = req_body.firstName;
        customer.lastName = req_body.lastName;
        customer.email = req_body.email;
        customer.address = req_body.address;
        customer.city = req_body.city;
        customer.state = s;
        customer.stateId = state[0].id;
        customer.zip = req_body.zip;
        customer.gender = req_body.gender;
        customer.id = 1; // The id is calculated by the Mongoose pre 'save'.

        customer.save(function (err, customer) {
            if (err) { console.log('*** new customer save err: ' + err); return callback(err); }

            callback(null, customer.id);
        });
    },

    editCustomer: function (id, req_body, state, callback) {
        console.log('*** accessDB.editCustomer');

        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name }

        Customer.findOne({ 'id': id }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'gender': 1, 'id': 1 }, function (err, customer) {
            if (err) { return callback(err); }

            customer.firstName = req_body.firstName || customer.firstName;
            customer.lastName = req_body.lastName || customer.lastName;
            customer.email = req_body.email || customer.email;
            customer.address = req_body.address || customer.address;
            customer.city = req_body.city || customer.city;
            customer.state = s;
            customer.stateId = s.id;
            customer.zip = req_body.zip || customer.zip;
            customer.gender = req_body.gender || customer.gender;


            customer.save(function (err) {
                if (err) { console.log('*** accessDB.editCustomer err: ' + err); return callback(err); }

                callback(null);
            });

        });
    },

    // delete a customer
    deleteCustomer: function (id, callback) {
        console.log('*** accessDB.deleteCustomer');
        Customer.remove({ 'id': id }, function (err, customer) {
            callback(null);
        });
    },

    // get a  customer's email
    checkUnique: function (id, property, value, callback) {
        console.log('*** accessDB.checkUnique');
        console.log(id + ' ' + value)
        switch (property) {
            case 'email':
                Customer.findOne({ 'email': value, 'id': { $ne: id} })
                        .select('email')
                        .exec(function (err, customer) {
                            console.log(customer)
                            var status = (customer) ? false : true;
                            callback(null, {status: status});
                        });
                break;
        }

    },

    // get all the states
    getStates: function (callback) {
        console.log('*** accessDB.getStates');
        State.find({}, {}, { sort: { name: 1 } }, function (err, states) {
            callback(null, states);
        });
    },

    // get a state
    getState: function (stateId, callback) {
        console.log('*** accessDB.getState');
        State.find({ 'id': stateId }, {}, function (err, state) {
            callback(null, state);
        });
    }
}