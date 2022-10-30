let task = [];
let prio = [];
let subtasks = [];
let contacts = [];
let actualPrio;
let createdTasks = 0;
let liCategory;
let liContact;
let twoSubtaskIcons = false;

/**
 * 
 * lädt die Seite mit dem aktuellem Datum
 */
async function initAddTask() {
    await includeHTML();
    generateDate();
}

/**
 * leert das array prio und aktiviert eine funktion um die 
 * dringlichkeit der task zu makieren
 * 
 * @param {string} id -Variable zu dem jeweiligen button
 */
function markedPrio(id) {
    prio = [];
    changeBg(id);
    document.getElementById("hidden-prio-input").value = '.';
}

/**
 * aktiviert eine funktion mit der ausgewählten id
 * 
 * @param {string} id -Variable zu dem jeweiligen button
 */
function changeBg(id) {
    let urgent = document.getElementById('prio-urgent');
    let medium = document.getElementById('prio-medium');
    let low = document.getElementById('prio-low');
    if (id == 'prio-urgent') {
        changeBgUrgent(urgent, medium, low);
    }
    if (id == 'prio-medium') {
        changeBgMedium(urgent, medium, low);
    }
    if (id == 'prio-low') {
        changeBgLow(urgent, medium, low);
    }
}

/**
 * makiert die dirnglichkeit der task durch veränderung der klassen
 * 
 * @param {*} urgent -steht für sehr wichtig
 * @param {*} medium -steht für wichtig
 * @param {*} low -steht für nicht so wichtig
 */
function changeBgUrgent(urgent, medium, low) {
    document.getElementById('urgent-img').src = "../img/arrow_urgent_white.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
    urgent.classList.add('bg-orange');
    medium.classList.remove('bg-yellow');
    low.classList.remove('bg-green');
}

/**
 * makiert die dirnglichkeit der task durch veränderung der klassen
 * 
 * @param {*} urgent -steht für sehr wichtig
 * @param {*} medium -steht für wichtig
 * @param {*} low -steht für nicht so wichtig
 */
function changeBgMedium(urgent, medium, low) {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium_white.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
    urgent.classList.remove('bg-orange');
    medium.classList.add('bg-yellow');
    low.classList.remove('bg-green');
}

/**
 * makiert die dirnglichkeit der task durch veränderung der klassen
 * 
 * @param {*} urgent -steht für sehr wichtig
 * @param {*} medium -steht für wichtig
 * @param {*} low -steht für nicht so wichtig
 */
function changeBgLow(urgent, medium, low) {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low_white.svg";
    urgent.classList.remove('bg-orange');
    medium.classList.remove('bg-yellow');
    low.classList.add('bg-green');
}

/**
 * ausgelöst durch einen Button werden die eingegebenen Informationen gebündelt in ein JSON 
 * gepusht und es werden funktionen zur speicherung des JSON auf dem Server ausgelöst
 * 
 */
async function addTask() {
    let title = document.getElementById('title');
    let descripton = document.getElementById('descripton');
    let sector = liCategory;
    if (document.getElementById('checkbox-contact-1').checked) {
        contacts.push(document.getElementById('contact-1').innerHTML);
    }

    if (document.getElementById('checkbox-contact-2').checked) {
        contacts.push(document.getElementById('contact-2').innerHTML);
    }

    if (document.getElementById('checkbox-contact-3').checked) {
        contacts.push(document.getElementById('contact-3').innerHTML);
    }


    let dueDate = document.getElementById('dueDate');

    let urgent = document.getElementById('prio-urgent');
    let medium = document.getElementById('prio-medium');
    let low = document.getElementById('prio-low');

    if (urgent.classList.contains('bg-orange')) {
        actualPrio = 'Urgent';
        prio.push(actualPrio);
    }
    if (medium.classList.contains('bg-yellow')) {
        actualPrio = 'Medium';
        prio.push(actualPrio);
    }
    if (low.classList.contains('bg-green')) {
        actualPrio = 'Low';
        prio.push(actualPrio);
    }



    let addTask = {
        "category": 'to-do',
        "id": 0,
        "title": title.value,
        "description": descripton.value,
        "sector": sector,
        "assingedTo": contacts,
        "dueDate": dueDate.value,
        "prio": actualPrio,
        "subtasks": subtasks
    };

    task.push(addTask);

    saveOnServer();
    clearContacts();
    clearPage();
    createdTasks++;
}

/**
 * löscht die makierung des kontaktes
 * 
 */
function clearContacts() {
    for (let i = 1; i < 4; i++) {
        document.getElementById(`checkbox-contact-${i}`).checked = false;
        document.getElementById(`initials-${i}`).classList.add('d-none');
    }
}


/**
 * speicherfunktion auf den Server
 * 
 */
async function saveOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('task', JSON.stringify(task));
}


/**
 * leert die inputfelder und eingaben
 * 
 */
function clearPage() {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
    document.getElementById('prio-urgent').classList.remove('bg-orange');
    document.getElementById('prio-medium').classList.remove('bg-yellow');
    document.getElementById('prio-low').classList.remove('bg-green');

    title.value = '';
    descripton.value = '';
    document.getElementById("hidden-category-input").value = '';
    document.getElementById("hidden-contact-input").value = '';
    document.getElementById("hidden-prio-input").value = '';
    document.getElementById('selected-category').innerHTML = 'Select task Category';
    document.getElementById('overview-subtasks').innerHTML = '';
    clearContacts();
    generateDate();
    prio = [];
    subtasks = [];
}


/**
 * lädt das aktuelle Datum in das inputfeldt
 * 
 */
function generateDate() {
    document.getElementById("dueDate").valueAsDate = new Date();
}


/**
 * durch klick auf einen button wird eine liste mit auswahl gezeigt
 * oder versteckt
 * 
 */
function showCategories() {
    let ulCategory = document.getElementById("ul-category");
    if (ulCategory.classList.contains('d-none')) {
        showSelectionCategories(ulCategory);
    }
    else {
        hideSelectionCategories(ulCategory);
    }
}


/**
 * eine auswahl von kategorien wird gezeitg
 * 
 * @param {string} ulCategory -id von der jeweiligen category
 */
function showSelectionCategories(ulCategory) {
    ulCategory.classList.remove('d-none');
    document.getElementById("select-div-category").classList.add('no-border-bottom');
}


/**
 * eine auswahl von kategorien wird versteckt
 * 
 * @param {string} ulCategory -id von der jeweiligen category
 */
function hideSelectionCategories(ulCategory) {
    ulCategory.classList.add('d-none');
    document.getElementById("select-div-category").classList.remove('no-border-bottom');
}


/**
 * durch klick auf einen button wird eine liste mit auswahl gezeigt
 * oder versteckt
 * 
 */
function showContacts() {
    let ulContact = document.getElementById("ul-contact");
    if (ulContact.classList.contains('d-none')) {
        showSelectionContacts(ulContact);
    }
    else {
        hideSelectionContacts(ulContact);
    }
}


/**
 * eine auswahl von kategorien wird gezeigt
 * 
 * @param {string} ulContact -id von dem jeweigen Kontakt
 */
function showSelectionContacts(ulContact) {
    ulContact.classList.remove('d-none');
    document.getElementById("select-div-contact").classList.add('no-border-bottom');
}


/**
 * eine auswahl von kategorien wird gezeigt
 * 
 * @param {string} ulContact -id von dem jeweigen Kontakt
 */
function hideSelectionContacts(ulContact) {
    ulContact.classList.add('d-none');
    document.getElementById("select-div-contact").classList.remove('no-border-bottom');
}


function selectCategory(id) {
    liCategory = id.replace('div-', '');
    let ulCategory = document.getElementById("ul-category");
    let category = document.getElementById(id).innerHTML;
    showSelectedCategory(category, liCategory);
    hideSelectionCategories(ulCategory);
}


function showSelectedCategory(category, liCategory) {
    document.getElementById('selected-category').style = 'display: flex; align-items: center; list-style-type: none;';
    document.getElementById("selected-category").innerHTML = category;
    document.getElementById("hidden-category-input").value = '.';
    document.getElementById(liCategory).style = 'margin:0; margin-right: 20px';
}


function showContacts() {
    let ulContact = document.getElementById("ul-contact");
    if (ulContact.classList.contains('d-none')) {
        document.getElementById('all-contacts-initials').classList.add('d-none');
        showSelectionContacts(ulContact);
    }
    else {
        hideSelectionContacts(ulContact);
        document.getElementById('all-contacts-initials').classList.remove('d-none');
    }
}


function selectContact(id) {
    liContact = id.replace('div-', '');
    let ulContact = document.getElementById("ul-contact");
    showSelectionContacts(ulContact);
}


function proofCheck(id) {
    let isChecked = document.getElementById(id);
    let initial = id.replace('checkbox-contact', 'initials');

    let initial1 = document.getElementById('initials-1');
    let initial2 = document.getElementById('initials-2');
    let initial3 = document.getElementById('initials-3');

    if (isChecked.checked == true) {
        document.getElementById(initial).classList.remove('d-none');
        document.getElementById("hidden-contact-input").value = '.';
    }
    else {
        document.getElementById(initial).classList.add('d-none');
    }

    if (initial1.classList.contains('d-none') && initial2.classList.contains('d-none') && initial3.classList.contains('d-none')) {
        document.getElementById("hidden-contact-input").value = '';
    }
}


function showXandCheckmark() {
    if (twoSubtaskIcons == false) {
        document.getElementById('subtask-icons').innerHTML = /*html*/ `
        <img onclick="closeSubtask()" id="close-icon" src="../img/close-icon.png" alt="close">
        <img onclick="addSubtask()" id="checkmark-icon" src="../img/checkmark.png" alt="checkmark">`;
        twoSubtaskIcons = true;
    }

    else {
        twoSubtaskIcons = false;
    }
}


function closeSubtask() {
    document.getElementById('subtask-input').value = '';
    document.getElementById('subtask-icons').innerHTML = /*html*/ `
    <img id="plus-icon" src="../img/plus-icon.png" alt="plus">`;
    twoSubtaskIcons = true;
}


function addSubtask() {
    let newSubtask = document.getElementById('subtask-input');
    if (newSubtask.value.length >= 1) {
        subtasks.push(newSubtask.value);
        showAllSubtasks();
        closeSubtask();
    }
}


function showAllSubtasks() {
    let allSubtasks = document.getElementById('overview-subtasks');
    allSubtasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];

        allSubtasks.innerHTML += newSubtaskTemplate(i, subtask);
    }
}


function newSubtaskTemplate(i, subtask) {
    return /*html*/ `
        <div class="subtask-div">
                <input type="checkbox" id="check-subtask-${i + 1}">
                <span class="subtask" id="subtask-${i + 1}">${subtask}</span>
        </div>`;
}


