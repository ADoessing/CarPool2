function checkFields(){

	email = document.getElementById("email").value;
	password1 = document.getElementById("password").value;

	regex_Email = /^([A-z]+[.]?[A-z]+)+@([A-z]+[.]?[A-z]+)+[.][a-z]{2,5}$/g
	regex_Password = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^]{8,})/g

	correctInformation = true;

	if (regex_Email.test(email)){
		document.getElementById("email").style.placeholder="OK";
	} else {
		document.getElementById("email").style.placeholder="Not an Email";
		correctInformation = false;
	}

	if (regex_Password.test(password1)){
		document.getElementById("password").style.placeholder="OK";
	} else {
		document.getElementById("password").style.placeholder="Not a valid Password";
		correctInformation = false;
	}

	return correctInformation;
}
