const express = require('express'),
    router = express.Router(),
    Band = require('../models/band').Band,
    Song = require('../models/song').Song,
    logger = require('../lib/log')(module);

// main page
router.get("/", function (req, res) {
    Band.find({}, function (err, bands) {
        if (err) {
            res.status(400);
            logger.error(err);
        } else {
            res.render("main", {
                "bands": bands
            });
        }
    })
});


// ajax route for main page (song list for selected band and info about each song)
router.get("/band/:id", function (req, res) {
    var id = req.params.id;

    Band.findById(id).populate("songs").exec(function (err, band) {
        if (err) {
            res.status(400);
            logger.error(err);
        } else {
            res.status(200).send({
                "songs": band.songs,
                "band": band
            });
        }
    });
});


module.exports = router;