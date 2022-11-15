let contact = [];

let alphabet = [];
let idNumberMemberBox = [];
let backgroundColorAlpha = [];
let backgroundColor = [];

/**
 * Connects the app to the server and starts the program
 * 
 */
async function initContacs() {
    await includeHTML();
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    contact = JSON.parse(backend.getItem('contact')) || [];
    alphabet = JSON.parse(backend.getItem('alphabet')) || [];
    backgroundColor = JSON.parse(backend.getItem('backgroundColor')) || [];
    loadABCContainer();
    sidebarBgPage();
}


/**
 * Execute functions to list the contacts.
 * 
 */
function loadContactside() {
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
}


/**
 * Stores data on the server.
 * 
 */
async function saveOnServer() {
    await backend.setItem('contact', JSON.stringify(contact));
    await backend.setItem('alphabet', JSON.stringify(alphabet));
    await backend.setItem('backgroundColor', JSON.stringify(backgroundColor));
}


/**
 * By changing the css classes, an input field for new contacts is opened.
 * 
 */
function newConatct() {
    document.getElementById('add-contact').classList.remove('d-none');
    document.getElementById('add-contact').classList.add('edit-contact', 'add-animation-edit-contact');
    document.getElementById('background-grey').classList.remove('d-none');
    document.getElementById('background-grey').classList.add('background-grey', 'add-animation-background-grey');
    setTimeout(() => {
        document.getElementById('add-contact').classList.remove('add-animation-edit-contact');
        document.getElementById('background-grey').classList.remove('add-animation-background-grey');
    }, 1000);
}


/**
 * A button function to close an input field.
 * 
 */
function cancel() {
    // document.getElementById('add-contact').classList.remove('edit-contact');
    document.getElementById('add-contact').classList.remove('edit-contact');
    document.getElementById('add-contact').classList.add('animate-reverse-edit-contact');
    document.getElementById('background-grey').classList.remove('background-grey');
    document.getElementById('background-grey').classList.add('animate-reverse-background-grey');
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
    setTimeout(() => {
        document.getElementById('add-contact').classList.add('d-none');
        document.getElementById('add-contact').classList.remove('animate-reverse-edit-contact');
        document.getElementById('background-grey').classList.remove('animate-reverse-background-grey');
        document.getElementById('background-grey').classList.add('d-none');
    }, 900);
}


/**
 * Takes the contents of the input fields and pushes them into the JSON contact as an array.
 * There will be functions to save on the server, emptying some content
 * and displaying the contacts is carried out.
 * 
 */
function addContact() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');

    let addContact = {
        "name": name.value,
        "email": email.value,
        "phone": phone.value,
    };

    contact.push(addContact);

    getRandomColor();
    contactCreatedSuccessfuly();
    addAndSaveContact();
    cancel();
}


function addAndSaveContact() {
    saveOnServer();
    clearInput();
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
}


/**
 * Empties the input fields with the respective ID.
 * 
 */
function clearInput() {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}


/**
 * This function reads the first letters of the Konrackte and pushes
 * into the array alphabet, with the letters capitalized.
 * 
 */
function pushFirstLetterJSON() {
    alphabet = [];
    for (let i = 0; i < contact.length; i++) {
        const member = contact[i];
        const memberFistLetter = member['name'].charAt(0);
        const firstLetter = memberFistLetter.toUpperCase();

        if (!alphabet.includes(firstLetter)) {   /*Wenn nicht vorhanden dann... */
            alphabet.push(firstLetter);
        }
    }
    alphabet.sort();
}

/**
 * Empties the entire container with the listed contacts.
 * 
 */
function clearContentLeft() {
    document.getElementById('content-left').innerHTML = ``;
}


/**
 * Iterates through the alphabet array, where the first letters of the contacts
 * are included. Then a container is written in HTML, there
 * the contacts are listed.
 * 
 */
function loadABCContainer() {
    let contactContainer = document.getElementById('content-left');

    for (let i = 0; i < alphabet.length; i++) {
        let abc = alphabet[i];
        contactContainer.innerHTML += abcHTML(abc);

        loadContacts(abc);
    }

}


/**
 * Iterates through the array contact and filters out the first few letters.
 * Then HTML text is written with alphabetically sorted contacts.
 * 
 * @param {string} abc - These are the first letters of the contacts.
 */
function loadContacts(abc) {

    let contactContainer = document.getElementById('member-container' + abc);
    for (let i = 0; i < contact.length; i++) {
        const member = contact[i];
        let firstLetter = member['name'].charAt(0);
        const bigFirstLetter = firstLetter.toUpperCase();

        if (!abc || abc == bigFirstLetter) {
            contactContainer.innerHTML += memberHTML(i);
            getFirstLetters(i);
            $("#shortcut-name" + i).css("background-color", backgroundColor[i]);
        }
    }
}


/**
 * Filters the first letters from all entered names.
 * The letters are merged into a string and written as HTML text.
 * 
 * @param {string} j - Variable to pass the affiliation of the contact test.
 */
function getFirstLetters(j) {
    document.getElementById('shortcut-name' + j).innerHTML = ``;
    const member = contact[j];
    let firstLetters = member['name'];
    let firstAndLastName = firstLetters.split(' ');
    let firstletterOfName = firstAndLastName.map(word => word[0]);
    let letters = firstletterOfName.join('');

    document.getElementById('shortcut-name' + j).innerHTML += addFirstLetters(letters);
}


/**
 * Button function to display the clicked contact on another container.
 * 
 * @param {string} i - Variable to pass the affiliation of the contact test.
 */
function showMemberInfo(i) {
    idNumberMemberBox.push(i);
    backgroundMemberBox(i);

    let letters = document.getElementById('shortcut-name' + i).innerHTML;
    let infoBox = document.getElementById('member-info');
    infoBox.innerHTML = ``;
    infoBox.innerHTML = memberInfoHtml(i, letters);
    document.getElementById('content-right').classList.add('z-index-99');
    $("#shortcut-name-info" + i).css("background-color", backgroundColor[i]);
}


/**
 * Changes the background color of the clicked container.
 * 
 * @param {string} i - Variable to pass the affiliation of the contact test.
 */
function backgroundMemberBox(i) {
    for (let y = 0; y < idNumberMemberBox.length; y++) {
        document.getElementById('member-box' + idNumberMemberBox[y]).classList.remove('blue-background');
    }

    document.getElementById('member-box' + i).classList.add('blue-background');
}


/**
 * By changing the css classes, an input field is opened to edit the contact.
 * 
 * @param {string} i - Variable to pass the affiliation of the contact test.
 */
function editContact(i) {
    let letters = document.getElementById('shortcut-name' + i).innerHTML;
    document.getElementById('edit-contact').classList.remove('d-none');
    document.getElementById('edit-contact').classList.add('edit-contact');
    document.getElementById('background-grey').classList.remove('d-none');
    document.getElementById('background-grey').classList.add('background-grey');
    document.getElementById('edit-contact').innerHTML += editContactHTML(i, letters);
    $("#member-firstLetter-container" + i).css("background-color", backgroundColor[i]);
}


/**
 * Closes the input field and empties the input fields.
 * 
 * @param {string} i - Variable to pass the affiliation of the contact test.
 */
function closeEdit(i) {
    document.getElementById('edit-contact').innerHTML = ``;
    document.getElementById('edit-contact').classList.remove('edit-contact');
    document.getElementById('edit-contact').classList.add('d-none');
    document.getElementById('background-grey').classList.remove('background-grey');
    document.getElementById('background-grey').classList.add('d-none');
}


/**
 * Saves the changed data of the contact.
 * 
 * @param {string} i -Variable to pass the affiliation of the contact test. 
 */
function save(i) {
    let name = document.getElementById('name' + i);
    let email = document.getElementById('email' + i);
    let phone = document.getElementById('phone' + i);

    contact[i] = {
        "name": name.value,
        "email": email.value,
        "phone": phone.value,
    };

    contactCreatedSuccessfuly();
    saveAndLoadContact(i);
}


function saveAndLoadContact(i) {
    saveOnServer();
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
    showMemberInfo(i);
    closeEdit(i);
}

function contactCreatedSuccessfuly() {
    document.getElementById('contact-created').classList.remove('d-none');
    document.getElementById('contact-created').classList.add('contact-created')
    setTimeout(() => {
        document.getElementById('contact-created').classList.remove('contact-created');
        document.getElementById('contact-created').classList.add('d-none');
    }, 2000);
}


/**
 * Creates a random color and pushes it into the backgroundColor array
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        background = color += letters[Math.floor(Math.random() * 16)];
        backgroundColorAlpha.push(background);
    }
    for (let y = 5; y < backgroundColorAlpha.length; y++) {
        const colorBackground = backgroundColorAlpha[y];
        backgroundColor.push(colorBackground);
        backgroundColorAlpha = [];
        saveOnServer();
    }
}


function closeContactInfo() {
    document.getElementById('content-right').classList.remove('z-index-99');
}


/////////////////////////////////////////// HTML /////////////////////////////////////////////////////////////


function memberHTML(i) {
    return /*HTML*/` 
    <button id="member-box${i}" onclick="showMemberInfo(${i})" class="member-box">
    <div id="shortcut-name${i}" class="shortcut-name">AM</div>
                <div>
                    <div class="fontsice-21">${contact[i]['name']}</div>
                    <div class="email">${contact[i]['email']}</div>
                </div>
                </button>
                `;
}


function abcHTML(letter) {
    return /*HTML*/`
    <button onclick="newConatct()" class="new-contact-responsiv">
                <span>New contact</span>
                <img src="../img/new-contact-icon.png">
            </button>
    <div class="member-container" id="member-container${letter}">
    <div id="abc${letter}" class="abc"><b>${letter}</b></div>
            </div>
            `;
}


function addFirstLetters(letters) {
    return /*HTML*/ `${letters}`
}


function memberInfoHtml(i, letters) {
    return /*HTML*/`
    <div class="member">
                    <div id="shortcut-name-info${i}" class="shortcut-name-info">${letters}</div>
                    <div>
                        <div class="name-info">${contact[i]['name']}</div>
                        <a href="add_task.html" class="email"><img class="plus" src="../img/blue-plus.png">Add Task</a>
                    </div>
                </div>

                <div class="contact-info-edit">
                    <div class="fontsice-21">Contact Information</div>
                    <div onclick="editContact(${i})" class="edit-contact-pencil"><img src="../img/pencil.png"> Contact</div>
                </div>
                <div onclick="editContact(${i})" class="edit-contact-icon"><img class="edit-contact-icon-img" src="../img/edit-icon.png"></div>
                <div>
                    <b>Email</b>
                    <div class="email">${contact[i]['email']}</div>
                </div>
                <div>
                    <b>Phone</b>
                    <div>+${contact[i]['phone']}</div>
                </div>

                <button onclick="newConatct()" class="new-contact">
                    <span>New contact</span>
                    <img src="../img/new-contact-icon.png">
                </button>
                `;
}


function editContactHTML(i, letters) {
    return /*HTML*/`
    <div class="cancel-button-responsiv"><img onclick="closeEdit(${i})" class="close-withe"
                    src="../img/plus-icon.png  "></div>
    <div class="edit-contact-left">
    <img class="logo" src="../img/logo.png">
    <div class="header-edit-contact">Edit contact</div>
    <div class="blue-border"></div>
</div>
<div class="edit-contact-right">
    <div>
        <div id="member-firstLetter-container${i}" class="member-firstLetter-container">
        ${letters}
        </div>
    </div>
    <form onsubmit="save(${i}); return false;" class="edit-contact-input">
        <input id="name${i}" required class="inputs-name" type="text" value="${contact[i]['name']}">
        <input id="email${i}" required class="inputs-email" type="email" value="${contact[i]['email']}">
        <input id="phone${i}" required class="inputs-phone" type="number" value="${contact[i]['phone']}">
        <div class="button-box">
            <div onclick="closeEdit(${i})" class="cancel-button">Cancel<img src="../img/close-icon.png"></div>
            <button class="creat-button">Save<img src="../img/checkmark.png"></button>
        </div>
    </form>
</div>
`;
}