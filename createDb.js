var mongoose = require('./lib/mongoose');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createInitialObjects
], function(err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./models/user');
    require('./models/band');
    require('./models/song');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createInitialObjects(callback) {
    const songs = [
        {name: 'ohne dich', lyrics: 'ohne dich lyrics test'}
    ];
    const bands = [
        {name: 'Rammstein', description: 'test description for ramm'}
    ];
    const users = [
        {username: 'admin', password: 'admin'}
    ];

    var band = new mongoose.models.Band(bands[0]);
    var user = new mongoose.models.User(users[0]);
    var song = new mongoose.models.Song(songs[0]);
    song.save(callback);
    band.songs.push(song);
    band.save(callback);
    user.songs.push(song);
    user.save(callback);

    // async.each(users, function(userData, callback) {
    //     var user = new mongoose.models.User(userData);
    //     user.save(callback);
    // }, callback);
}