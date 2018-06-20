const express = require('express'),
    router = express.Router(),
	db = require("../lib/db")

// main page
router.get("/", function (req, res) {
    db.getBands(function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            res.render("main", {
                "bands": result
            });
        }
    })
});


// ajax route for main page (song list for selected band and info about each song)
router.get("/band/:id", function (req, res) {
    id = req.params.id;
    db.getSongsByBand(id, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            res.status(200).send({
                "res": result
            });
        }
    })
});


module.exports = router