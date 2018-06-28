const express = require('express'),
	router = express.Router(),
	loggedIn = require('../middlewares/loggedIn');
	isAdmin = require('../middlewares/isAdmin');


router.use(function (req, res, next) {
	res.locals.loggedIn = req.session.user;
	next();
});

// includes of other routes
//router.use('/admin', isAdmin, require('./admin'));
router.use('/favourite', loggedIn, require('./favourite'));
router.use('/main', require('./main'));
router.use('/login', require('./login'));


// redirecting on start
router.get("/", function (req, res) {
	res.redirect("/main")
});

// logout route
router.get("/logout", loggedIn, function (req, res) {
	req.session.destroy();
	res.redirect("/main");
});

module.exports = router;