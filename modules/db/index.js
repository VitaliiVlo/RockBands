var mysql = require('mysql');
var MySQLStore = require('express-mysql-session');
var config = require('../config');

var options = {
  host: config.get('db:host'),
  port: config.get('db:port'),
  user: config.get('db:user'),
  password: config.get('db:password'),
  connectionLimit: config.get('db:connectionlimit'),
  database: config.get('db:database')
}

var session_options = {
  checkExpirationInterval: 7200000, // How frequently expired sessions will be cleared; milliseconds. 
  expiration: 86400000, // The maximum age of a valid session; milliseconds. 
  createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist. 
};

var connection = mysql.createPool(options);
// connection.connect(function(err) {})
var sessionStore = new MySQLStore(session_options, connection, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connection is established...");
  }
});

exports.sessionStore = sessionStore;

exports.getBands = function(cb) {
  connection.query("select * from band", function(err, result) {
    cb(err, result)
  });
}

exports.getUserByLogin = function(login, cb) {
  q = "SELECT * FROM user WHERE login=?";

  connection.query(q, [login], function(err, result) {
    cb(err, result);
  })
}

exports.getSongsByBand = function(id, cb) {
  q = "SELECT * FROM song INNER JOIN band ON song.band_id=? AND band.band_id=?";

  connection.query(q, [id, id], function(err, result) {
    cb(err, result);
  });
}

exports.getSongsByUser = function(user, cb) {
  q = "SELECT * FROM favor NATURAL JOIN song WHERE favor.user_id=?";

  connection.query(q, [user], function(err, result) {
    cb(err, result);
  });
}

exports.getSongByUserAndSong = function(user, song, cb) {
  q = "SELECT * FROM favor WHERE user_id=? AND song_id=?";

  connection.query(q, [user, song], function(err, result) {
    cb(err, result);
  });
}

exports.getBandByName = function(name, cb) {
  q = "SELECT * FROM band WHERE bandname=?";

  connection.query(q, [name], function(err, result) {
    cb(err, result);
  });
}

exports.addFeedback = function(name, subj, mess, cb) {
  q = "INSERT INTO feedback VALUES (NULL,?,?,?)";

  connection.query(q, [name, subj, mess], function(err, result) {
    cb(err, result);
  });
}

exports.addUser = function(login, pass, cb) {
  q = "INSERT INTO user VALUES (NULL,?,?)";

  connection.query(q, [login, pass], function(err, result) {
    cb(err, result);
  })
}

exports.addFavor = function(user, song, cb) {
  q = "INSERT INTO favor VALUES (?,?)";
  connection.query(q, [user, song], function(err, result) {
    cb(err, result);
  });
}

exports.deleteFavor = function(user, song, cb) {
  q = "DELETE FROM favor WHERE user_id=? AND song_id=?";
  connection.query(q, [user, song], function(err, result) {
    cb(err, result);
  });
}

exports.addSong = function(name, band, cb) {
  q = "INSERT INTO song VALUES (NULL,?,'default',?)";
  connection.query(q, [name, band], function(err, result) {
    cb(err, result);
  });
}

exports.addBand = function(name, cb) {
  q = "INSERT INTO band VALUES (NULL,?,'default','default','default',0)";
  connection.query(q, [name], function(err, result) {
    cb(err, result);
  });
}

exports.findForLyrics = function(cb) {
  q = "SELECT song.songname,band.bandname FROM song NATURAL JOIN band WHERE song.words=?";
  connection.query(q, ["default"], function(err, result) {
    cb(err, result);
  });
}

exports.addLyrics = function(song, text) {
  q = "UPDATE song SET words=? WHERE songname=?";
  connection.query(q, [text, song], function(err, result) {

    if (err) {
      console.log(err);
    }

  });
}

exports.findBandParse = function(cb) {
  q = "SELECT bandname FROM band WHERE description=?";
  connection.query(q, ["default"], function(err, result) {
    cb(err, result);
  });
}

exports.addBandDescr = function(band,descr) {
  q = "UPDATE band SET description=? WHERE bandname=?";
  connection.query(q, [descr, band], function(err, result) {

    if (err) {
      console.log(err);
    }

  });
}