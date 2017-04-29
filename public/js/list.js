var g;

$(document).ready(function(){

	$.ajax({
		url: "/findsong",
		success: function(data) {

			g = data;

			var s = ""
			var d = ""

			for (var k = 0; k < data.playlist.length; k++) {
				s = s + "<li onclick=words(" + k + "); id='w"+k+"' class='list-group-item list-group-item-success'>" + data.playlist[k].songname + "</li>"
				d = d + "<li id='d"+k+"' onclick=del(" + k + "); class='list-group-item list-group-item-danger'>Удалить</li>"
			}
			
			$("#songlist").html(s);
			$("#deletelist").html(d);

		}
	})

})

function words(k){
	$("#words").html(g.playlist[k].words);
	var varforsong = g.playlist[k].songname;
	varforsong = varforsong.toLowerCase();
	varforsong = varforsong.replace(/\s+/g,"");
	$("#player").attr("src","public/audio/"+varforsong+".mp3");

	$("#player").hide();
	$("#aud").show();
	$("#myModal").modal();
}

function play(){
	$("#aud").hide();
	$("#player").show();
	$('#player').animate({
		width : "90%"
	});
}

function del(k){
	var w = "w"+k;
	var d = "d"+k;

	var id = g.playlist[k].song_id;

	$("#"+w).fadeOut();
	$("#"+d).fadeOut();

	$.ajax({url: "/deletesong/"+id})
}