let contact = [{
    'name': 'Rudolf Hans Krause',
    'email': 'Krause@mmail.de',
    'phone': 3464536,
}];

let alphabet = [];

async function initContacs() {
    await includeHTML();
    await downloadFromServer();
    contact = JSON.parse(backend.getItem('contact')) || [];
    alphabet = JSON.parse(backend.getItem('alphabet')) || [];
}


async function saveOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join/smallest_backend_ever-master");
    await backend.setItem('contact', JSON.stringify(contact));
    await backend.setItem('alphabet', JSON.stringify(alphabet));
}


function newConatct() {
    document.getElementById('edit-contact').classList.remove('d-none');
    document.getElementById('edit-contact').classList.add('edit-contact');
}


function cancel() {
    document.getElementById('edit-contact').classList.remove('edit-contact');
    document.getElementById('edit-contact').classList.add('d-none');
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}

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
    console.log(contact);

    saveOnServer();
    clearInput();
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
}


function clearInput() {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}


function pushFirstLetterJSON() {
    alphabet = [];
    for (let i = 0; i < contact.length; i++) {
        const member = contact[i];
        const memberFistLetter = member['name'].charAt(0);    /*Übernimmt den ersten Buchstaben aus dem string (position 0) */
        const firstLetter = memberFistLetter.toUpperCase(); /* schreibt den Buchstaben Groß */

        if (!alphabet.includes(firstLetter)) {   /*Wenn nicht vorhanden dann... */
            alphabet.push(firstLetter);
        }
    }
    alphabet.sort();
}


function clearContentLeft() {
    document.getElementById('content-left').innerHTML = ``;
}


function loadABCContainer() {
    let contactContainer = document.getElementById('content-left');

    for (let i = 0; i < alphabet.length; i++) {
        let abc = alphabet[i];
        contactContainer.innerHTML += abcHTML(abc);

        loadContacts(abc);
    }

}


function loadContacts(abc) {

    let contactContainer = document.getElementById('member-container' + abc);
    for (let i = 0; i < contact.length; i++) {
        const member = contact[i];
        let firstLetter = member['name'].charAt(0);
        const bigFirstLetter = firstLetter.toUpperCase();

        if (!abc || abc == bigFirstLetter) {
            contactContainer.innerHTML += memberHTML(i);
            getFirstLetters(i);
        }
    }
}


function getFirstLetters(j) {
    document.getElementById('shortcut-name' + j).innerHTML = ``;
    const member = contact[j];
    let firstLetters = member['name'];
    let firstAndLastName = firstLetters.split(' ');
    let firstletterOfName = firstAndLastName.map(word => word[0]);
    let letters = firstletterOfName.join('');

    document.getElementById('shortcut-name' + j).innerHTML += addFirstLetters(letters);
}

/////////////////////////////////////////// HTML ////////////////////////////////////////


function memberHTML(i) {
    return /*HTML*/` 
    <div id="shortcut-name${i}" class="shortcut-name">AM</div>
                <div>
                    <div class="fontsice-21">${contact[i]['name']}</div>
                    <div class="email">${contact[i]['email']}</div>
                </div>
                `;
}


function abcHTML(letter) {
    return /*HTML*/`
    <div id="member-container${letter}">
    <div id="abc${letter}" class="abc"><b>${letter}</b></div>
            </div>
            `;
}


function addFirstLetters(letters) {
    return /*HTML*/ `${letters}`
}