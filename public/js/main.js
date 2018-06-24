var songs;
var fav;
var notAdded = "&#9734;";
var added = "&#9733;";

function showBand(band) {
    $.ajax({
        url: 'main/band/' + band,
        success: function (data) {
            songs = data.songs;

            var songList = "";
            for (var k = 0; k < songs.length; k++) {
                songList = songList + "<li class='list-group-item list-group-item-success' onclick=lyrics('" + k + "');>" +
                                          songs[k].name +
                                      "</li>";
            }
            $("#songs").html(songList);

            var descriptionTemplate = "<h1>" + data.band.name + "</h1> <b> Описание : </b>" + data.band.description + "<br>";
            $("#description").html(descriptionTemplate);

            $("body").css("background-image", "url("+ data.band.image +")");
        }
    })
}

function lyrics(k) {
    $("#words").html(songs[k].lyrics);

    var player = $("#player");
    player.attr("src", songs[k].audio);

    fav = songs[k]._id;

    player.hide();
    player.css("width", "0");
    $("#aud").show();

    var addBtn = $("#addbtn");
    addBtn.removeClass('disabled');
    addBtn.removeClass('btn-success');
    addBtn.addClass('btn-info');
    addBtn.html(notAdded);

    $("#myModal").modal();
}

function play() {
    $("#aud").fadeOut();

    var player = $("#player");
    player.show();
    player.animate({
        width: "100%"
    });
}

function favor() {
    $.ajax({url: "/favourite/add/" + fav});

    var addBtn = $("#addbtn");
    addBtn.removeClass('btn-info');
    addBtn.addClass('btn-success');
    addBtn.addClass('disabled');
    addBtn.html(added);
}