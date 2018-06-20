var request = require('request');
var cheerio = require('cheerio');
var db = require("../db");

function finddescr(artist) {

	var title = artist;

	artist = artist.replace(/ /g, "_")

	var url = "https://ru.wikipedia.org/wiki/"+artist;

	var html = "";

	var descr = "";

	request(url, function(err, res, body) {
		if (err) console.log(err);
		html = body;
		flag=true;

		var $ = cheerio.load(html);

		$("table[class=vcard]").remove();
		$("div[id=frb-inline]").remove();

		$('div[class=mw-parser-output]').children("p").each(function(){
			if($(this).text()===""){
				flag=false;
			}
			else if(flag){
				descr = descr + $(this).text() + "\n";
			}
		})

		descr = descr.replace(/\[.*\]/g,"");
		
		db.addBandDescr(title,descr);



	});

}

module.exports = function(){
	db.findBandParse(function(err,result){

		if(err){
			console.log(err);
		}

		for (var k = 0; k < result.length; k++) {
				finddescr(result[k].bandname);
		}


	});
}