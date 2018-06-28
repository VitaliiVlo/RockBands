const request = require('request'),
    cheerio = require('cheerio'),
    logger = require('../lib/log')(module),
    Band = require('../models/band').Band;

function findDescription(artist) {
    var title = artist;
    artist = artist.replace(/ /g, "_");
    var url = "https://ru.wikipedia.org/wiki/" + artist;
    var html = "";
    var descr = "";

    request(url, function (err, res, body) {
        if (err) logger.error(err);
        html = body;

        var $ = cheerio.load(html);

        $("table[class=vcard]").remove();
        $("div[id=frb-inline]").remove();

        var flag = true;
        $('div[class=mw-parser-output]').children("p").each(function () {
            if ($(this).text() === "") {
                flag = false;
            }
            else if (flag) {
                descr = descr + $(this).text() + "\n";
            }
        });

        descr = descr.replace(/\[.*\]/g, "");

        Band.findOneAndUpdate({name: title}, {description: descr}, function (err) {
            if (err) {
                logger.error(err);
            }
        });

    });
}

module.exports = function () {
    Band.find({description: {$exists: false}}).exec(function (err, bands) {
        if (err) {
            logger.error(err);
            return;
        }
        for (var k = 0; k < bands.length; k++) {
            findDescription(bands[k].name);
        }
    });
};