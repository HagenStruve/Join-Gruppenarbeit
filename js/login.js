let users = [];

async function initLogin() {
    setURL("https://gruppe-313.developerakademie.net/Join/smallest_backend_ever-master");
    await downloadFromServer();
    users = await JSON.parse(backend.getItem('users')) || [];
}



function showSignUp() {
    window.location.href = "../html/sign_up.html";
}

function showLogin() {
    window.location.href = "../html/login.html";
}

function guestLogin() {
    window.location.href = "../html/summary.html";
}


function successfulRegistration() {
    addUser();

    document.getElementById('overlay').classList.remove('d-none');
    document.getElementById('successful-registration').classList.remove('d-none');
    console.log(users);
}


function addUser() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    users.push({ name: name.value, email: email.value, password: password.value });
    backend.setItem('users', JSON.stringify(users));
    console.log(users);
}


function proofLogin() {
    let loginEmail = document.getElementById('login-email');
    let loginPassword = document.getElementById('login-password');

    let user = users.find(u => u.email == loginEmail.value && u.password == loginPassword.value);
    if (user) {
        window.location.href = "../html/summary.html";
    }
}


function proofInputs() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let user = users.find(u => u.email == email.value);

    if (user) {
        document.getElementById('password').classList.add('no-margin-bottom');
        document.getElementById('email-in-use').classList.remove('d-none');
    }

    else if (name.value.length >= 1 && email.value.length >= 1 && password.value.length >= 1) {
        document.getElementById('submit-button').classList.remove('d-none');
        document.getElementById('no-submit-button').classList.add('d-none');
    }

    if (!user) {
        document.getElementById('password').classList.remove('no-margin-bottom');
        document.getElementById('email-in-use').classList.add('d-none');
    }
}



