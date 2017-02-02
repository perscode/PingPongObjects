var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;
  
var matchSchema = Schema({
    won: Schema.Types.Mixed,
    lost: Schema.Types.Mixed,
    regby: String,
    date: {type: Date, default: Date.now }
});
var Match = mongoose.model('Match', matchSchema); 
module.exports = Match;