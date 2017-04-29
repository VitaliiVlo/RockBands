$(document).ready(function () {
	$("#auth").click(function() {
		$("#form").html('<input type="text" name="" placeholder="Логин" id="email"><input type="password" name="" placeholder="Пароль" id="password"><div id="show"></div><button id="logbuta">Войти</button>');

		$("#logbuta").click(function() {
			var login = $("#email").val();
			var password = $("#password").val();

			$.ajax({
				url: "/checkuser",
				type: "post",
				data: {"password":password,"login":login},
				success: function(data){
					if(data.log=="true"){
						window.location.href = '/';
					}
					else{
						$("#show").html("Неправильный логин или пароль"+"<div><br></div>");
						$("#show").css("color","red");
						$("#show").show();
					}
				}
			})
		})

	});

	$("#reg").click(function() {
		$("#form").html('<input type="text" name="" placeholder="Логин" id="email"><input type="password" name="" placeholder="Пароль" id="password"><input type="password" name="" placeholder="Повторите пароль" id="password_rep"><div id="show"></div><button id="logbutr">Регистрация</button>');

		$("#logbutr").click(function () {
		$("#show").hide();
		var email = $("#email").val();
		var password = $("#password").val();
		var password_rep = $("#password_rep").val();
		var fail="";
		if(email.length<3)
			fail="Логин минимум 3 символа";
		else if(password.length<4)
			fail = "Пароль минимум 4 символа";
		else if(password!=password_rep)
			fail = "Пароли не совпадают";

		if(fail != "") {
			$("#show").html(fail+"<div><br></div>");
			$("#show").css("color","red");
			$("#show").show();
			return false;
		}
		else{
			$.ajax({
				url: "/adduser",
				type: "post",
				data: {"login":email,"password":password},
				success: function(data){
					if(data.reg=="true"){
						$("#show").html("Регистрация прошла успешно"+"<div><br></div>");
						$("#show").css("color","green");
						$("#email").val("");
						$("#password").val("");
						$("#password_rep").val("");
						$("#show").show();	
					}
					else {
						$("#show").html("Такой пользователь уже существует"+"<div><br></div>");
						$("#show").css("color","red");
						$("#show").show();
					}
				
				}
			})
			
		}

	});

	});


});