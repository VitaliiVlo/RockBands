const User = require("../models/user").User,
    logger = require('../lib/log')(module);

module.exports = function (req, res, next) {
    User.findById(req.session.user, function (err, user) {
        if (err) {
            res.sendStatus(404);
            logger.error(err);
        } else if (!user) {
            res.sendStatus(404);
        } else {
            if (user.username === "admin") {
                next();
            } else {
                res.sendStatus(404);
            }
        }
    });
};