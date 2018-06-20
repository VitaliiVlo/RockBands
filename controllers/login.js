const express = require('express'),
    router = express.Router(),
    db = require("../modules/db")
    

// login page
router.get("/", function (req, res) {
    res.render("login");
})

// route for login (select from database and creating new session with property USER=USER_ID)
router.post("/user/check", function (req, res) {
    login = req.body.login;
    pass = req.body.password;

    db.getUserByLogin(login, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            if (result.length == 1 && result[0].password === pass) {
                req.session.user = result[0].user_id;
                res.status(200).send({
                    "log": "true"
                });
            } else {
                res.status(200).send({
                    "log": "false"
                });
            }
        }
    })
})


// route for adding new user into database (registration)
// todo : password encrypt
router.post("/user/add", function (req, res) {
    login = req.body.login;
    pass = req.body.password;

    db.getUserByLogin(login, function (err, result) {
        if (err) {
            res.status(400);
            console.log(err);
            return;
        } else {
            if (result.length == 1) {
                res.status(200).send({
                    "reg": "false"
                });
            } else if (result.length == 0) {
                db.addUser(login, pass, function (error, result) {
                    if (error) {
                        res.status(400);
                        console.log(err);
                        return;
                    } else {

                        res.status(200).send({
                            "reg": "true"
                        });
                    }
                })
            }
        }
    })
})

module.exports = router