const express = require('express'),
	router = express.Router(),
	db = require("../modules/db"),
	parser = require('../modules/parser'),
	bandparser = require('../modules/bandparser');


// admin page
router.get("/", function (req, res) {
	res.render("admin");
})

// ajax route to check containing of band
router.post("/findband", function (req, res) {

	var name = req.body.bandname;

	db.getBandByName(name, function (err, result) {

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
router.post("/addsong", function (req, res) {
	name = req.body.songname;
	band = req.body.bandid;

	if (band == -1 || name == "") {
		res.status(200);
		return;
	}

	db.addSong(name, band, function (err, result) {
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
router.get("/findwords", function (req, res) {
	parser();
	res.status(200);
})

router.get("/findbands", function (req, res) {
	bandparser();
	res.status(200);
})

// ajax route to add new band into database
router.post("/addband", function (req, res) {
	var bandname = req.body.bandname;

	db.addBand(bandname, function (err, result) {
		if (err) {
			res.status(400);
			console.log(err);
			return;
		} else {
			res.status(200);
		}
	})
})


module.exports = router