var g;
var fav;
var notadded = "&#9734;";
var added = "&#9733;";

function doajax (band) {
	$.ajax({
		url: '/band/'+band,
		success: function(data) {
			g=data;
			var s = "";
			for(var k=0;k<data.res.length;k++){
				s=s+"<li class='list-group-item list-group-item-success' onclick=words('"+k+"');>"+data.res[k].songname+"</li>";
			}
			$("#songs").html(s);

			$("#description").html("<h1>"+data.res[0].bandname+"</h1> <b> Описание : </b>"+data.res[0].description+"<br>");

			var bn = data.res[0].bandname;
			bn = bn.toLowerCase();
			bn = bn.replace(/\s+/g,"");
			$("body").css("background-image","url(/public/images/"+bn+".jpg)");
		}
	})
}

function words(k){
	$("#words").html(g.res[k].words);
	var varforsong = g.res[k].songname;
	varforsong = varforsong.toLowerCase();
	varforsong = varforsong.replace(/\s+/g,"");
	$("#player").attr("src","public/audio/"+varforsong+".mp3");
	
	fav = g.res[k].song_id;

	$("#player").hide();
	$("#player").css("width","0");
	$("#aud").show();

	$.ajax({
		url: "/checkadd/"+fav,
		success: function(data){
			if(data.flag=="true"){
				$("#addbtn").removeClass('btn-info');
				$("#addbtn").addClass('btn-success');
				$("#addbtn").addClass('disabled');
				$("#addbtn").html(added);
			}
			else{
				$("#addbtn").removeClass('disabled');
				$("#addbtn").removeClass('btn-success');
				$("#addbtn").addClass('btn-info');
				$("#addbtn").html(notadded);
			}
		}
	})

	$("#myModal").modal();
}

function play(){
	$("#aud").fadeOut();
	$("#player").show();
	$('#player').animate({
		width : "100%"
	});
}

function favor(){
	$.ajax({url: "/add/"+fav})
	$("#addbtn").removeClass('btn-info');
	$("#addbtn").addClass('btn-success');
	$("#addbtn").addClass('disabled');
	$("#addbtn").html(added);
}