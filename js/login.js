function showSignUp() {
    document.getElementById('login-field').classList.add('d-none');
    document.getElementById('sign-up-field').classList.add('d-none');
    document.getElementById('register-field').classList.remove('d-none');
}


function showLogin() {
    document.getElementById('login-field').classList.remove('d-none');
    document.getElementById('sign-up-field').classList.remove('d-none');
    document.getElementById('register-field').classList.add('d-none');
}

function successfulRegistration() {
    document.getElementById('password').classList.add('no-margin-bottom');
    document.getElementById('successful-registration').classList.remove('d-none');
}

function proofInputs() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    console.log(name.value);
    console.log(email.value);
    console.log(password.value);


    // if (name.value.l >=  && email.value.lenght >= 1 && password.value.lenght >= 1) {
    //     document.getElementById('submit-button').classList.remove('d-none');
    //     document.getElementById('no-submit-button').classList.add('d-none');
    // }
}



