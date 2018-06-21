const express = require('express'),
	app = express(),
	db = require("./lib/db"),
	path = require('path'),
	session = require('express-session'),
	config = require('./config'),
	logger = require('./lib/log')(module)


app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/public", express.static(path.join(__dirname, 'public')));

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(require('cookie-parser')());

app.use(require('serve-favicon')(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
	key: config.get('session:key'),
	secret: config.get('session:secret'),
	saveUninitialized: config.get('session:saveun'),
	resave: config.get('session:resave'),
	store: db.sessionStore
}))


app.use(require('./controllers'))


const port = app.get("env") == 'development' ? config.get("port") : process.env.PORT
app.listen(port, function () {
	logger.info("Server listening on the port " + port);
})