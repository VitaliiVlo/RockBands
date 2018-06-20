const express = require('express'),
    router = express.Router(),
    db = require("../modules/db")

router.get("/", function (req, res) {
    res.render("favourite");
})

// ajax route to add new favourite song (main page)
router.get("/add/:id", function (req, res) {
    song = req.params.id;
    user = req.session.user;

    db.addFavor(user, song, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            res.status(200);
        }
    })
})

// select info about each song of user (favourite page)
router.get("/list", function (req, res) {
    user = req.session.user;

    db.getSongsByUser(user, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            res.status(200).send({
                "playlist": result
            });
        }
    })
})

// route to delete song from favourite list
router.get("/delete/:id", function (req, res) {
    song = req.params.id;
    user = req.session.user;

    db.deleteFavor(user, song, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            res.status(200);
        }
    })
})


// check song existing in favoutite list
router.get("/check/:id", function (req, res) {
    song = req.params.id;
    user = req.session.user;

    db.getSongByUserAndSong(user, song, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {

            var flag;
            if (result.length == 1) {
                flag = "true";
            } else if (result.length == 0) {
                flag = "false";
            }

            res.status(200).send({
                "flag": flag
            });

        }
    })
})


module.exports = router