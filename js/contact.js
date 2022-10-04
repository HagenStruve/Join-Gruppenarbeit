let contact = [];

let alphabet = [];


async function init() {
    await downloadFromServer();
    contact = JSON.parse(backend.getItem('contact')) || [];
    loadContacts();
}


async function saveOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join/smallest_backend_ever-master");
    await backend.setItem('task', JSON.stringify(contact));
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
    loadContacts(); 
}


function clearInput() {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}


function loadContacts(filter) {
    let contactContainer = document.getElementById('member-box');

    contactContainer.innerHTML = ``
    for (let i = 0; i < contact.length; i++) {
        const member = contact[i];
        const firstLetter = member['name'].charAt(0);

        if (!filter || filter == firstLetter) {
            contactContainer.innerHTML += memberHTML(member);
        }

        if (!alphabet.includes(firstLetter)) {
            alphabet.push(firstLetter);
        }
    }
    loadAbc();
}



function loadAbc() {
    let abc = document.getElementById('abc');
    abc.innerHTML = '';

    for (let j = 0; j < alphabet.length; j++) {
        let letter = alphabet[j];
        abc.innerHTML += abcHTML(letter);
    }
}

/////////////////////////////////////////// HTML ////////////////////////////////////////


function memberHTML(member) {
    return /*HTML*/` 
    <div class="shortcut-name">AM</div>
                <div>
                    <div class="fontsice-21">${member['name']}</div>
                    <div class="email">${member['email']}</div>
                </div>
                `;
}


function abcHTML(letter) {
    return /*HTML*/`
                <b>${letter}</b>
            `;
}