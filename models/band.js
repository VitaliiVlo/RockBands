const mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    image: String,
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }]
});

exports.Band = mongoose.model('Band', schema);