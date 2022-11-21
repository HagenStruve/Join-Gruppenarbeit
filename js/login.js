
// after the successful registration, name, e-mail and password will be saved in this array
let users = [];
let resetPasswordEmail;


/**
 * load the URL and then the registered users from the backend
 */
async function initLogin() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    users = await JSON.parse(backend.getItem('users')) || [];
    pageOpenerAnimation();
    checkRememberMe();
}


async function initResetPassword() {
    initLogin();
    resetPasswordEmail = window.location.search;
    resetPasswordEmail = resetPasswordEmail.replace("?", "");
}


function pageOpenerAnimation() {
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
        if (document.getElementById('checkbox-remember-me').checked) {
            let checkboxRememberMe = document.getElementById('checkbox-remember-me');
            localStorage.setItem("checkboxRememberMe", checkboxRememberMe.checked);
        }
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userPassword", user.password);
        window.location.href = "../html/summary.html";
    }

    if (!document.getElementById('checkbox-remember-me').checked) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');
        localStorage.removeItem('checkboxRememberMe');
    }

    else { //warning appears
        document.getElementById('login-password').classList.add('no-margin-bottom');
        document.getElementById('wrong-login-dates').classList.remove('d-none');
    }
}



function checkRememberMe() {
    if (localStorage.getItem("checkboxRememberMe")) {
        let loginEmail = document.getElementById('login-email');
        let loginPassword = document.getElementById('login-password');
        let checkBox = document.getElementById('checkbox-remember-me');
        loginEmail.value = localStorage.getItem('userEmail');
        loginPassword.value = localStorage.getItem('userPassword');
        checkBox.checked = localStorage.getItem('checkboxRememberMe');
    }

    if (!document.getElementById('checkbox-remember-me').checked) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');
        localStorage.removeItem('checkboxRememberMe');
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

    if (loginEmail.value.length < 1 || loginPassword.value.length < 1) { //warning will be removed
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
    setOrRemoveWarningAndSetButton(name, email, password, user)
}





/**
 * 
 * proof different cases in the sign up process and shows the Warning or removes it
 */
function setOrRemoveWarningAndSetButton(name, email, password, user) {
    if (user) {
        showEmailInUseWarning();
    }
    else if (name.value.length >= 1 && email.value.length >= 1 && password.value.length >= 1) {
        showSubmitButton();
    }
    if (!user || !document.getElementById('successful-registration').classList.contains('d-none')) {
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


/**
 * warning apperas when you reset the password and both reset passwords are not equal
 */
function showPasswordNotEqualWarning() {
    document.getElementById('reset-password-confirm').classList.add('no-margin-bottom');
    document.getElementById('pw-not-equal-text').classList.remove('d-none');
}


/**
 * when reset passwords are equal and meet the standard the new password will be saved and you
 * will forwarded to the login page, else the warning appears
 */
function resetPassword() {
    let resetPassword = document.getElementById('reset-password');
    let confirmResetPassword = document.getElementById('reset-password-confirm');
    if (resetPassword.value === confirmResetPassword.value) {
        saveNewPassword(confirmResetPassword);
        setTimeout(() => {
            window.location.href = "../html/login.html"
        }, 1500);
    }

    else {
        showPasswordNotEqualWarning();
    }
}


/**
 * @param {is the new password} confirmResetPassword 
 * new password will be saved in the backend
 */
function saveNewPassword(confirmResetPassword) {
    let indexEmail = users.findIndex(arr => arr.email == resetPasswordEmail);
    users[indexEmail].password = confirmResetPassword.value;
    backend.setItem('users', JSON.stringify(users));
    showResetPasswordAnimation();
}


/**
 * after successful reset password, animation appears
 */
function showResetPasswordAnimation() {
    document.getElementById('overlay-reset-password').classList.remove('d-none');
    document.getElementById('overlay-btn-reset-password').classList.remove('d-none');
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
    if (resetPasswordEmail.value.length < 1 || user) {
        removeWarningEmail();
    }
}


function removeWarningEmail() {
    document.getElementById('email-to-reset-password').classList.remove('no-margin-bottom');
    document.getElementById('email-not-registered-warning').classList.add('d-none');
}


function sendMailForgotPassword() {
    document.getElementById('overlay-forgot-password').classList.remove('d-none');
    document.getElementById('overlay-btn-forgot-password').classList.remove('d-none');
}


function setAction(form) {
    let emailResetPassword = document.getElementById('email-to-reset-password').value;
    let registeredEmail = users.find(u => u.email == emailResetPassword);
    if (!registeredEmail) { //show warning
        document.getElementById('email-to-reset-password').classList.add('no-margin-bottom');
        document.getElementById('email-not-registered-warning').classList.remove('d-none');
        return false;
    }


    sendMailForgotPassword();
    form.action = "https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/send_mail.php";
    form.method = "post";
}

