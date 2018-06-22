const mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: "sessions"
});

module.exports = sessionStore;