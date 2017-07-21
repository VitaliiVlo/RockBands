var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	db = require("./modules/db"),
	python = require("./modules/python"),
	ejs = require('ejs-locals'),
	path = require('path'),
	favicon = require('serve-favicon'),
	session = require('express-session'),
	config = require('./modules/config');

app.engine('html', ejs);
app.engine('ejs', ejs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(session({
	key: config.get('session:key'),
	secret: config.get('session:secret'),
	saveUninitialized: config.get('session:saveun'),
	resave: config.get('session:resave'),
	store: db.sessionStore
}))


// Check auth

function loggedIn(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

function isAdmin(req, res, next) {
	if (req.session.user == 1) {
		next();
	} else {
		res.redirect("/main");
	}
}

// redirecting on start

app.get("/", function(req, res) {
	if (req.session.user) {
		res.redirect("/main")
	} else {
		res.redirect("/login")
	}
})

// login page

app.get("/login", function(req, res) {
	res.render("login");
})

// main page

app.get("/main", loggedIn, function(req, res) {

	db.getBands(function(err, result) {
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

// feedback page

app.get("/feedback", loggedIn, function(req, res) {

	res.render("feedback");

});

// user favourite songs page

app.get("/playlist", loggedIn, function(req, res) {

	res.render("favourite");
})

// logout route

app.get("/logout", loggedIn, function(req, res) {
	req.session.destroy();
	res.redirect("/");
})



// Routes for AJAX



// add feedback into database

app.post("/send", function(req, res) {
	name = req.body.name;
	subj = req.body.subject;
	mess = req.body.message;

	db.addFeedback(name, subj, mess, function(err, result) {
		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {
			res.status(200);
		}
	})

});


// route for login (select from database and creating new session with property USER=USER_ID)

app.post("/checkuser", function(req, res) {
	login = req.body.login;
	pass = req.body.password;

	db.getUserByLogin(login, function(err, result) {
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

app.post("/adduser", function(req, res) {
	login = req.body.login;
	pass = req.body.password;

	db.getUserByLogin(login, function(err, result) {

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

				db.addUser(login, pass, function(error, result) {
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


// ajax route for main page (song list for selected band and info about each song)

app.get("/band/:id", loggedIn, function(req, res) {
	id = req.params.id;
	db.getSongsByBand(id, function(err, result) {

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


// ajax route to add new favourite song (main page)

app.get("/add/:id", loggedIn, function(req, res) {
	song = req.params.id;
	user = req.session.user;

	db.addFavor(user, song, function(err, result) {
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

app.get("/findsong", loggedIn, function(req, res) {
	user = req.session.user;

	db.getSongsByUser(user, function(err, result) {
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

app.get("/deletesong/:id", loggedIn, function(req, res) {
	song = req.params.id;
	user = req.session.user;

	db.deleteFavor(user, song, function(err, result) {
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

app.get("/checkadd/:id", function(req, res) {
	song = req.params.id;
	user = req.session.user;

	db.getSongByUserAndSong(user, song, function(err, result) {
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



// admin routes 



// admin page

app.get("/admin/", isAdmin, function(req, res) {
	res.render("admin");
})

// ajax route to check containing of band

app.post("/admin/findband", isAdmin, function(req, res) {

	var name = req.body.bandname;

	db.getBandByName(name, function(err, result) {

		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {

			var id;
			if (result.length == 1) {
				id = result[0].band_id;
			} else if (result.length == 0) {
				id = -1;
			}

			res.status(200).send({
				"id": id
			});

		}

	})
})

// ajax route to add new song

app.post("/admin/addsong", isAdmin, function(req, res) {

	name = req.body.songname;
	band = req.body.bandid;

	if (band == -1 || name == "") {
		res.status(200);
		return;
	}

	db.addSong(name, band, function(err, result) {
		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {
			res.status(200);
		}
	})

})

// ajax route to run python script to parse metrolyrics

app.get("/admin/findwords", isAdmin, function(req, res) {

	python.findLyrics(function(err, results) {
		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {
			res.status(200).send({
				"python": results
			});
		}
	})
})

app.get("/admin/findbands", isAdmin, function(req, res) {
	python.findBands(function(err, results) {
		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {
			res.status(200).send({
				"python": results
			});
		}
	})
})

// ajax route to add new band into database

app.post("/admin/addband", isAdmin, function(req, res) {

	var bandname = req.body.bandname;

	db.addBand(bandname, function(err, result) {
		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {
			res.status(200);
		}
	})
})



app.listen(config.get('port'), function() {
	console.log("app started");
})