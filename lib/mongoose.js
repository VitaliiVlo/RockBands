const mongoose = require('mongoose'),
    config = require('../config');

mongoose.connect(config.get('mongoose:uri'));

module.exports = mongoose;