function checkFields(){

	regex_Username = /^([A-Za-z0-9]){1}([A-z0-9]|[-_]){0,19}$/g
	regex_Password = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^]{8,})/g
	regex_Email = /^([A-z]+[.]?[A-z]+)+@([A-z]+[.]?[A-z]+)+[.][a-z]{2,5}$/g


	correctInformation = true;

	password1 = document.getElementById("password").value;
	password2 = document.getElementById("password_repeat").value;
	email = document.getElementById("email").value;
	username = document.getElementById("username").value;

	if (regex_Username.test(username)){
		document.getElementById("username").style.borderColor="black";
	} else {
		document.getElementById("username").style.borderColor="red";
		correctInformation = false;
	}

	if (regex_Password.test(password1)){
		document.getElementById("password").style.borderColor="black";
	} else {
		document.getElementById("password").style.borderColor="red";
		correctInformation = false;
	}

	if (password1 === password2){
		document.getElementById("password_repeat").style.borderColor="black";
	} else {
		document.getElementById("password_repeat").style.borderColor="red";
		correctInformation = false;
	}

	if (regex_Email.test(email)){
		document.getElementById("email").style.borderColor="black";
	} else {
		document.getElementById("email").style.borderColor="red";
		correctInformation = false;
	}
	return correctInformation;
}
