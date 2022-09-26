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


