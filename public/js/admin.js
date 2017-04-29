function newinput(ev) {

	ev.target.removeAttribute("onfocus");

	$("#songcreate").append('<input type="text" name="song" onfocus="newinput(event)" placeholder="song"><br>')
}

function go() {
	var bandid;
	var band = $("#band").val();
	$.ajax({
		url: "/admin/findband",
		type: "post",
		data: {
			'bandname': band
		},
		success: function(data) {
			bandid = data.id;


			if (bandid == -1) {
				$("#p").html("Band not found");
			} else {
				$("#p").html("");

				var mas = document.getElementsByName("song");

				for (var i = 0; i < mas.length - 1; i++) {
					if (mas[i].value == "") {
						continue;
					}
					$.ajax({
						url: "/admin/addsong",
						type: "post",
						data: {
							"songname": mas[i].value,
							"bandid": bandid
						}
					})

				}

				$("#p").html("songs added");
			}

		}
	})


}

function findwords() {
	$.ajax({
		url: "/admin/findwords",
		success: function(data) {
			for (var i = 0; i < data.python.length; i++) {
				$("#findp").append(data.python[i] + "<br>");
			}
		}
	})
}

function findbands() {
	$.ajax({
		url: "/admin/findbands",
		success: function(data) {
			for (var i = 0; i < data.python.length; i++) {
				$("#findp").append(data.python[i] + "<br>");
			}
		}
	})
}

function clearlog() {
	$("#findp").html("");
}

function addband() {
	var bandname = $("#addbandname").val();

	$.ajax({
		url: "/admin/addband",
		type: "post",
		data: {
			"bandname": bandname
		}
	})

	$("#bandp").html("All is ok, band successfully added")

}