var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Player = require('./player');
  
var matchSchema = Schema({
    players: [Schema.Types.Mixed],
    winner: {type: String},
    date: {type: Date, default: Date.now }
});
var Match = mongoose.model('Match', matchSchema); 
module.exports = Match;