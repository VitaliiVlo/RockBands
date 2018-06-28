var songs;

$(document).ready(function () {
    $.ajax({
        url: "/favourite/list",
        success: function (data) {
            songs = data.playlist;

            var s = "";
            var d = "";
            for (var k = 0; k < songs.length; k++) {
                s = s + "<li onclick=lyrics(" + k + "); id='w" + k + "' class='list-group-item list-group-item-success'>" + songs[k].name + "</li>";
                d = d + "<li id='d" + k + "' onclick=del(" + k + "); class='list-group-item list-group-item-danger'>&times;</li>"
            }

            $("#songlist").html(s);
            $("#deletelist").html(d);
        }
    })
});

function lyrics(k) {
    $("#words").html(songs[k].lyrics);
    var player = $("#player");
    player.attr("src", songs[k].audio);
    player.hide();
    player.css("width", "0");

    $("#aud").show();
    $("#myModal").modal();
}

function play() {
    $("#aud").hide();
    var player = $("#player");
    player.show();
    player.animate({
        width: "90%"
    });
}

function del(k) {
    var w = "w" + k;
    var d = "d" + k;

    var id = songs[k]._id;

    $("#" + w).hide();
    $("#" + d).hide();

    $.ajax({url: "/favourite/delete/" + id})
}