const request = require('request'),
    cheerio = require('cheerio'),
    logger = require('../lib/log')(module),
    Song = require('../models/song').Song,
    Band = require('../models/band').Band;

function findLyrics(song, artist) {
    var songTitle = song;
    song = song.toLowerCase();
    artist = artist.toLowerCase();
    song = song.replace(/ /g, "-");
    artist = artist.replace(/ /g, "-");

    var url = "http://www.metrolyrics.com/" + song + "-lyrics-" + artist + ".html";
    var html = "";
    var lyrics = "";

    request(url, function (err, res, body) {
        if (err) logger.error(err);
        html = body;

        var $ = cheerio.load(html);

        $('p[class=verse]').each(function () {
            lyrics = lyrics + $(this).text() + "\n\n";
        });

        Song.findOneAndUpdate({name: songTitle}, {lyrics: lyrics}, function (err) {
            if (err) {
                logger.error(err)
            }
        })
    });

}

module.exports = function () {
    Song.find({lyrics: {$exists: false}}).populate("band").exec(function (err, songs) {
        if (err) {
            logger.error(err);
            return;
        }
        for (var k = 0; k < songs.length; k++) {
            findLyrics(songs[k].name, songs[k].band.name);
        }
    });
};