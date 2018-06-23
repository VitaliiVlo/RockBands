const mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    lyrics: String,
    audio: String
});

exports.Song = mongoose.model('Song', schema);