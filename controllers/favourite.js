const express = require('express'),
    router = express.Router(),
    logger = require('../lib/log')(module),
    Song = require('../models/song').Song,
    User = require('../models/user').User;


router.get("/", function (req, res) {
    res.render("favourite");
});

// ajax route to add new favourite song (main page)
router.get("/add/:song_id", function (req, res) {
    var song_id = req.params.song_id;
    var user_id = req.session.user;

    User.findById(user_id).populate('songs').exec(function (err, user) {
        if (err) {
            res.status(400);
            logger.error(err);
        }
        user.songs.push(song_id);
        user.save(function (err) {
            if (err) {
                res.status(400);
                logger.error(err);
            } else {
                res.status(200);
            }
        });
    });
});

// select info about each song of user (favourite page)
router.get("/list", function (req, res) {
    var user_id = req.session.user;

    User.findById(user_id).populate('songs').exec(function (err, user) {
        if (err) {
            res.status(400);
            logger.error(err);
        } else {
            res.status(200).send({
                "playlist": user.songs
            });
        }
    });
});

// route to delete song from favourite list
router.get("/delete/:user_id", function (req, res) {
    var song_id = req.params.user_id;
    User.findByIdAndUpdate(req.session.user, {$pull: {songs: song_id}}).exec(function (err) {
        if (err) {
            res.status(400);
            logger.error(err);
        } else {
            res.status(200);
        }
    });
});

module.exports = router;