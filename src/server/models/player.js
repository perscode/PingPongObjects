var mongoose = require('mongoose');
mongoose.set('debug', true);
var Match = require('./matches');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
  
var playerSchema = new Schema({
    name: {
        type : String, required: true, unique: true
    },
    elo: {
        type: Number, required: true
    },
    wins: Number,
    losses: Number,
    total: Number,
    matches: [String]
});

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;
