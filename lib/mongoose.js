const mongoose = require('mongoose'),
    logger = require('./log')(module),

config = require('../config');
mongoose.connect(config.get('mongoose:uri')).then(
    function () {
        logger.info("Database connection is established");
    },
    function (err) {
        logger.error("Failed to connect to the database");
        throw err;
    });

module.exports = mongoose;