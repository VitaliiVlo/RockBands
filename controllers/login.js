const express = require('express'),
    router = express.Router(),
    User = require("../models/user").User;


// login page
router.get("/", function (req, res) {
    res.render("login");
});

// route for login (creating new session with property USER=USER_ID)
router.post("/user/check", function (req, res) {
    var username = req.body.login;
    var password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) {
            res.status(200).send({
                "log": "false"
            });
        } else {
            req.session.user = user._id;
            res.status(200).send({
                "log": "true"
            });
        }
    });
});

// route for adding new user into database (registration)
router.post("/user/add", function (req, res) {
    username = req.body.login;
    password = req.body.password;

    User.reg(username, password, function (err, user) {
        if (err) {
            res.status(200).send({
                "reg": "false"
            });
        } else {
            res.status(200).send({
                "reg": "true"
            });
        }
    });
});

module.exports = router;