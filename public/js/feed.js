$(document).ready(function () {
	$("#send").click(function () {
		$("#show").hide();
		var name = $("#name").val();
		var email = $("#email").val();
		var subject = $("#subject").val();
		var message = $("#message").val();
		var fail="";
		if (name.length<3) fail= "Имя не меньше 3 символов";
		else if(email.split("@").length - 1 == 0 || email.split(".").length - 1 == 0)
			fail="Некорректный Email";
		else if (subject.length<5)
			fail = "Тема не меньше 5 символов";
		else if(message.length<20)
			fail = "Сообщение не меньше 20 символов";
		if(fail != "") {
			$("#show").html(fail+"<div><br></div>");
			$("#show").css("color","red");
			$("#show").show();
			return false;
		}
		else{
			$("#show").html("Сообщение отправлено"+"<div><br></div>");
			$("#show").css("color","green");
			
			$("#name").val("");
			$("#email").val("");
			$("#subject").val("");
			$("#message").val("");
			$("#show").show();

			$.ajax({
				url: "/send",
				type: "post",
				data: {"name":name,"subject":subject,"message":message}
			})

		}

	});
});