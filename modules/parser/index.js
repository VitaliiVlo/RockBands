var request = require('request');
var cheerio = require('cheerio');
var db = require("../db");

function findLyr(song, artist) {
	var songtitle = song;
	song = song.toLowerCase();
	artist = artist.toLowerCase();
	song = song.replace(/ /g, "-");
	artist = artist.replace(/ /g, "-")

	var url = "http://www.metrolyrics.com/" + song + "-lyrics-" + artist + ".html";

	var html = "";

	var lyrics = "";

	request(url, function(err, res, body) {
		if (err) console.log(err);
		html = body;

		var $ = cheerio.load(html);

		$('p[class=verse]').each(function() {
			lyrics = lyrics + $(this).text() + "\n\n";
		})

		db.addLyrics(songtitle, lyrics);

	});

}

module.exports = function() {
	db.findForLyrics(function(err, result) {

		if (err) {
			console.log(err);
		}

		for (var k = 0; k < result.length; k++) {
				findLyr(result[k].songname, result[k].bandname);
		}

	});
}