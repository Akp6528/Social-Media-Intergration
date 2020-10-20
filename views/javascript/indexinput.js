//// signup validation
const form = document.getElementById('signupform');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

//add event listioner to signup form submit
form.addEventListener('submit', e => {
	document.getElementById("loader-wrapper").style.backgroundColor = '#242f3f70';
	document.getElementById("loader-wrapper").style.animation = '';
	//stop form to auto submit
	e.preventDefault();
	//check inputs
	checkSignupInputs();
});

//signup input chek
function checkSignupInputs() {
	// trim to remove the whitespaces
	var isValid = true;
	const displaynameValue = username.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();
	const password2Value = password2.value.trim();

	if (displaynameValue === '') {
		setErrorFor(username, 'Username cannot be blank');
		isValid = false;
	} else {
		setSuccessFor(username);
	}

	if (emailValue === '') {
		setErrorFor(email, 'Email cannot be blank');
		isValid = false;
	} else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
		isValid = false;
	} else {
		setSuccessFor(email);
	}

	if (passwordValue === '') {
		setErrorFor(password, 'Password cannot be blank');
		isValid = false;
	} else if (passwordValue.length < 6){
		setErrorFor(password, 'Password length cannot be less then six');
		isValid = false;
	} 
	else {
		setSuccessFor(password);
	}

	if (password2Value === '') {
		setErrorFor(password2, 'Password2 cannot be blank');
		isValid = false;
	} else if (passwordValue !== password2Value) {
		setErrorFor(password2, 'Password length cannot be less then six');
		isValid = false;
	} else {
		setSuccessFor(password2);
	}

	if (isValid) {
		singUp(emailValue, passwordValue, displaynameValue);
	}
	else{
		document.getElementById("loader-wrapper").style.animation = "loader-wrapper linear forwards";
	}
}


////login validiation
const loginform = document.getElementById('loginform');
const loginemail= document.getElementById('loginemail');
const loginpassword = document.getElementById('loginpassword');

loginform.addEventListener('submit', e => {
	//loading
	document.getElementById("loader-wrapper").style.backgroundColor = '#242f3f70';
	document.getElementById("loader-wrapper").style.animation = '';
	//stop form to auto submit
	e.preventDefault();
	//check inputs
	checkInputslogin();
});

function checkInputslogin() {
	// trim to remove the whitespaces
	var isValid = true;
	const emailValue = loginemail.value.trim();
	const passwordValue = loginpassword.value.trim();

	if (emailValue === '') {
		// setErrorFor(emailValue, 'Email cannot be blank');
		isValid = false;
	} else if (!isEmail(emailValue)) {
		// setErrorFor(emailValue, 'Not a valid email');
		isValid = false;
	} else {
		// setSuccessFor(emailValue);
	}

	if (passwordValue === '') {
		// setErrorFor(passwordValue, 'Password cannot be blank');
		isValid = false;
	} else {
		// setSuccessFor(passwordValue);
	}	

	if(isValid){
		signIn(emailValue,passwordValue);
	}else {
		document.getElementById("loader-wrapper").style.animation = "loader-wrapper linear forwards";
	}
}


//genral error funcion
function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}