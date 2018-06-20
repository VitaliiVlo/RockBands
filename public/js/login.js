function auth() {
	var login = $("#inputName").val().toLowerCase();
	var password = $("#inputPassword").val();

	$.ajax({
		url: "/login/user/check",
		type: "post",
		data: {
			"password": password,
			"login": login
		},
		success: function(data) {
			if (data.log == "true") {
				window.location.href = '/';
			} else {
				$("#auth-error").show();
			}
		}
	})

}



function reg() {

	$("#reg-ok").hide();
	$("#reg-login-error").hide();
	$("#reg-password-error").hide();
	$("#reg-login-length-error").hide();
	$("#reg-password-length-error").hide();

	var login = $("#RegInputName").val().toLowerCase();
	var password = $("#RegInputPassword").val();
	var password_rep = $("#RegInputPasswordConfirm").val();
	var fail = false;
	if (login.length < 3) {
		$("#reg-login-length-error").show();
		fail = true;
	}
	if (password.length < 5) {
		$("#reg-password-length-error").show();
		fail = true;
	}
	if (password != password_rep) {
		$("#reg-password-error").show();
		fail = true;
	}

	if (fail) {} else {

		$.ajax({
			url: "/login/user/add",
			type: "post",
			data: {
				"login": login,
				"password": password
			},
			success: function(data) {
				if (data.reg == "true") {
					$("#RegInputName").val("");
					$("#RegInputPassword").val("");
					$("#RegInputPasswordConfirm").val("");
					$("#reg-ok").show();
				} else {
					$("#reg-login-error").show();
				}
			}
		})

	}


}