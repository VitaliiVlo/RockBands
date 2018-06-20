module.exports = function (req, res, next) {
    if (req.session.user == 1) {
        next();
    } else {
        res.redirect("/main");
    }
}