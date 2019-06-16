const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    series: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    }
});

// Create collection and add schema
const Vote = mongoose.model('Poll', VoteSchema);
 module.exports = Vote;