let contact = [];

let alphabet = [];
let idNumberMemberBox = [];

/**
 * Verbindet die App mit dem Server und startet das Programm
 * 
 */
async function initContacs() {
    await includeHTML();
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    contact = JSON.parse(backend.getItem('contact')) || [];
    alphabet = JSON.parse(backend.getItem('alphabet')) || [];
    loadABCContainer();
}


/**
 * Führ Funktionen aus um die Kontakte aufzulisten.
 * 
 */
function loadContactside() {
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
}


/**
 * Speichert Daten auf dem Server.
 * 
 */
async function saveOnServer() {
    await backend.setItem('contact', JSON.stringify(contact));
    await backend.setItem('alphabet', JSON.stringify(alphabet));
}


/**
 * Durch veränderung der css Klassen wird ein Eingabefeld für neue Kontakte geöffnet.
 * 
 */
function newConatct() {
    document.getElementById('add-contact').classList.remove('d-none');
    document.getElementById('add-contact').classList.add('edit-contact');
}


/**
 * Eine Button Funktion um ein Eingabefeld zu schließen.
 * 
 */
function cancel() {
    document.getElementById('add-contact').classList.remove('edit-contact');
    document.getElementById('add-contact').classList.add('d-none');
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}


/**
 * Nimmt die inhalte der Eingabefelder und pusht sie als Array in das JSON contact.
 * Es werden Funktionen zur speicherung auf dem Server, leerung einiger inhalte 
 * und das Anzeigen der Kontakte ausgeführt.
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
    console.log(contact);

    saveOnServer();
    clearInput();
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
}


/**
 * Leert die Inputfelder mit der jeweigen ID.
 * 
 */
function clearInput() {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}


/**
 * Diese Funktion liest die ersten Buchstaben der Konrackte aus und pusht
 * sie in das Array alphabet, dabei werden die Buchstaben groß geschrieben.
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
 * Leert den kompletten Container mit den aufgelisteten Kontakten.
 * 
 */
function clearContentLeft() {
    document.getElementById('content-left').innerHTML = ``;
}


/**
 * Iterriert durch das alphabet Array, wo die anfangsbuchstaben von den Kontakten 
 * enthalten sind. Anschließend wird ein Container in HTML geschrieben, dort
 * werden die Kontakte aufgelistet.
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
 * Iterriert durch das Array contact und filtert die ersten Buchchstaben aus.
 * Anschließend wird HTML Text geschrieben mit Alphabetisch sortierten Kontakten.
 * 
 * @param {string} abc - Dies sind die Anfangsbuchstaben von den Konatkten.
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
        }
    }
}


/**
 * Filtert die ersten Buchstaben aus allen eingegebenen Namen.
 * Die Buchstaben werden zu einem string zusammengeführt und als HTML Text geschrieben.
 * 
 * @param {string} j - Variable um die Zugehörigkeit des Kontaktest weiterzugeben.
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
 * Buttonfuktion um den Angeklickten Kontakt auf einem anderem Container anzuzeigen.
 * 
 * @param {string} i - Variable um die Zugehörigkeit des Kontaktest weiterzugeben.
 */
function showMemberInfo(i) {
    idNumberMemberBox.push(i);
    backgroundMemberBox(i);

    let letters = document.getElementById('shortcut-name' + i).innerHTML;
    let infoBox = document.getElementById('member-info');
    infoBox.innerHTML = ``;
    infoBox.innerHTML = memberInfoHtml(i, letters);
}


/**
 * Verädert die Hintergrundfarbe des angeklickten Containers.
 * 
 * @param {string} i - Variable um die Zugehörigkeit des Kontaktest weiterzugeben. 
 */
function backgroundMemberBox(i) {
    for (let y = 0; y < idNumberMemberBox.length; y++) {
        document.getElementById('member-box' + idNumberMemberBox[y]).classList.remove('blue-background');
    }
    
    document.getElementById('member-box' + i).classList.add('blue-background');
}


/**
 * Durch veränderung der css Klassen wird ein Eingabefeld geöffnet um den Kontakt zu Bearbeiten.
 * 
 * @param {string} i - Variable um die Zugehörigkeit des Kontaktest weiterzugeben.
 */
function editContact(i) {
    let letters = document.getElementById('shortcut-name' + i).innerHTML;
    document.getElementById('edit-contact').classList.remove('d-none');
    document.getElementById('edit-contact').classList.add('edit-contact');
    document.getElementById('edit-contact').innerHTML += editContactHTML(i, letters);
}


/**
 * Schließt das Eingabefeld und leert die Inputfelder.
 * 
 * @param {string} i - Variable um die Zugehörigkeit des Kontaktest weiterzugeben. 
 */
function closeEdit(i) {
    document.getElementById('edit-contact').innerHTML = ``;
    document.getElementById('edit-contact').classList.remove('edit-contact');
    document.getElementById('edit-contact').classList.add('d-none');
    document.getElementById('name' + i).value = "";
    document.getElementById('email' + i).value = "";
    document.getElementById('phone' + i).value = "";
}


/**
 * Speichert die veränderten Daten des Kontaktes.
 * 
 * @param {string} i -Variable um die Zugehörigkeit des Kontaktest weiterzugeben. 
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

    saveOnServer();
    clearContentLeft();
    pushFirstLetterJSON();
    loadABCContainer();
    showMemberInfo(i);
    closeEdit(i);
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
    <div id="member-container${letter}">
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
                    <div class="shortcut-name-info">${letters}</div>
                    <div>
                        <div class="fontsice-21">${contact[i]['name']}</div>
                        <a href="add_task.html" class="email"><img class="plus" src="../img/blue-plus.png">Add Task</a>
                    </div>
                </div>

                <div class="contact-info-edit">
                    <div class="fontsice-21">Contact Information</div>
                    <div onclick="editContact(${i})" class="edit-contact-pencil"><img src="../img/pencil.png"> Contact</div>
                </div>
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
    <div class="edit-contact-left">
    <img class="join-logo" src="../img/logo.png">
    <div class="header-edit-contact">Edit contact</div>
    <div class="blue-border"></div>
</div>
<div class="edit-contact-right">
    <div>
        <div class="member-firstLetter-container">
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