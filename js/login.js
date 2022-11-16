
// after the successful registration, name, e-mail and password will be saved in this array
let users = [];


/**
 * load the URL and then the registered users from the backend
 */
async function initLogin() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    users = await JSON.parse(backend.getItem('users')) || [];
    document.body.style.opacity = '1';
    document.getElementById('logo').style = 'transform: translateX(-100%) translateY(-100%); left: 120px; top: 130px; scale: 1.0;';
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


/**
 * after successful registration overlay over the whole page appears and a container which says that the registration was successful
 * a div have the id=succesful-registration, this div includes a button. When you click the button you will be forwarded to the login page
 */
function successfulRegistration() {
    document.getElementById('email');
    let user = users.find(u => u.email == email.value);
    if (user) {
        return false;
    } else {
        addUser();
        document.getElementById('overlay').classList.remove('d-none');
        document.getElementById('successful-registration').classList.remove('d-none');
    }
}


/**
* pushes the value from the registration input fields in the users array
* array will be saved as a JSON in the backend
*/
function addUser() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    users.push({ name: name.value, email: email.value, password: password.value });
    backend.setItem('users', JSON.stringify(users));
    console.log(users);
}


/**
 * when you click on the Login Button, this function will be carried out
 * function searches the email and the password from the login input fields in the users array
 * if the email and password are in the array, login was succesful
 * else a div appears that tell you, that the login dates are wrong
 */
function proofLogin() {
    let loginEmail = document.getElementById('login-email');
    let loginPassword = document.getElementById('login-password');

    let user = users.find(u => u.email == loginEmail.value && u.password == loginPassword.value);
    if (user) {
        window.location.href = "../html/summary.html";
    }

    else {
        document.getElementById('login-password').classList.add('no-margin-bottom');
        document.getElementById('wrong-login-dates').classList.remove('d-none');
    }
}


/**
 * onkeyup function
 * function set the div with the information about wrong login dates on display:none,
 * when the input email or the input password field are cleared by the user
 */
function proofInputLogin() {
    let loginEmail = document.getElementById('login-email');
    let loginPassword = document.getElementById('login-password');

    if (loginEmail.value.length < 1 || loginPassword.value.length < 1) {
        document.getElementById('login-password').classList.remove('no-margin-bottom');
        document.getElementById('wrong-login-dates').classList.add('d-none');
    }
}


/**
 * onkeyup function
 */
function proofInputSignUp() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value);
    if (user) {
        showEmailInUseWarning();
    }
    else if (name.value.length >= 1 && email.value.length >= 1 && password.value.length >= 1) {
        showSubmitButton();
    }
    if (!user) {
        removeEmailInUseWarning();
    }
    if (!document.getElementById('successful-registration').classList.contains('d-none')) {
        removeEmailInUseWarning();
    }
}


/**
 * if you write an email in the registration email input field which already exists in the users array,
 * div appears which tells you that the email is already in use
 */
function showEmailInUseWarning() {
    document.getElementById('password').classList.add('no-margin-bottom');
    document.getElementById('email-in-use').classList.remove('d-none');
    document.getElementById('submit-button').classList.add('d-none');
    document.getElementById('no-submit-button').classList.remove('d-none');
}


/**
 * if the warning div, that the mail in the registration email input field is already in use, will be showed,
 * this array removes the warning div if the user change the email in the input field
 */
function removeEmailInUseWarning() {
    document.getElementById('password').classList.remove('no-margin-bottom');
    document.getElementById('email-in-use').classList.add('d-none');
}


/**
 * if every input field in the sign up container includes min. 1 symbol, the submit button will be showed
 * before that a span, which looks almost the same as the submit button, will be showed and you can't click on that span
 */
function showSubmitButton() {
    document.getElementById('submit-button').classList.remove('d-none');
    document.getElementById('no-submit-button').classList.add('d-none');
}


function showPasswordNotEqualWarning() {
    document.getElementById('reset-password-confirm').classList.add('no-margin-bottom');
    document.getElementById('pw-not-equal-text').classList.remove('d-none');
}


function resetPassword() {
    let resetPassword = document.getElementById('reset-password');
    let confirmResetPassword = document.getElementById('reset-password-confirm');

    if (resetPassword.value === confirmResetPassword.value) {
        console.log('Passwort zurückgesetzt')
        document.getElementById('overlay-reset-password').classList.remove('d-none');
        document.getElementById('overlay-btn-reset-password').classList.remove('d-none');
        setTimeout(() => {
            window.location.href = "../html/login.html"
        }, 1500);
    }

    else {
        showPasswordNotEqualWarning();
    }
}


function removePasswordsNotEqualWarning() {
    let resetPassword = document.getElementById('reset-password');
    let confirmResetPassword = document.getElementById('reset-password-confirm');

    if (resetPassword.value.length < 1 || confirmResetPassword.value.length < 1) {
        document.getElementById('reset-password-confirm').classList.remove('no-margin-bottom');
        document.getElementById('pw-not-equal-text').classList.add('d-none');
    }
}


function removeEmailNotRegisteredWarning() {
    let resetPasswordEmail = document.getElementById('email-to-reset-password');
    let user = users.find(u => u.email == resetPasswordEmail.value);
    let submitButton = document.getElementById('submit-btn');

    if (!user) {
        document.getElementById('email-to-reset-password').classList.add('no-margin-bottom');
        document.getElementById('email-not-registered-warning').classList.remove('d-none');
        submitButton.disabled = true;
    }

    else if (resetPasswordEmail.value.length < 1) {
        document.getElementById('email-to-reset-password').classList.remove('no-margin-bottom');
        document.getElementById('email-not-registered-warning').classList.add('d-none');
        submitButton.disabled = true;
    }

    else {
        let name = document.getElementById('email-to-reset-password').value;
        window.location.href = "../send_mail.php?name=" + name;
        submitButton.disabled = false;
    }
}

// function sendPHP() {
//     let name = document.getElementById('email-to-reset-password').value;
//     window.location.href = "../send_mail.php?name=" + name;
// }


function sendMailForgotPassword() {
    console.log('durchgeführt');
    // let resetPasswordEmail = document.getElementById('email-to-reset-password');
    // let user = users.find(u => u.email == resetPasswordEmail.value);
    // let submitButton = document.getElementById('submit-btn');

    // if (!user) {
    //     document.getElementById('email-to-reset-password').classList.add('no-margin-bottom');
    //     document.getElementById('email-not-registered-warning').classList.remove('d-none');
    //     submitButton.disabled = true;
    // }

    // else {
    document.getElementById('overlay-forgot-password').classList.remove('d-none');
    document.getElementById('overlay-btn-forgot-password').classList.remove('d-none');
    // submitButton.disabled = false;
    // }
}

