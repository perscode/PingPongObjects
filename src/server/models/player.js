var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;
  
var playerSchema = new Schema({
    name: {
        type : String, required: true, unique: true
    },
    elo: {
        type: Number, required: true
    },
    wins: Number,
    losses: Number,
    nickname: String,
    quote: String,
    total: Number,
    matches: [String]
});

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;
