let task = [];
let prio = [];
let createdTasks = 0;
let liCategory;
let liContact;
let twoSubtaskIcons = false;


async function initAddTask() {
    await includeHTML();
    generateDate();
}


function markedPrio(id) {
    prio = [];
    changeBg(id);
    document.getElementById("hidden-prio-input").value = '.';
    let prioId = document.getElementById(id);
    prio.push(prioId)
}


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


function changeBgUrgent(urgent, medium, low) {
    document.getElementById('urgent-img').src = "../img/arrow_urgent_white.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
    urgent.classList.add('bg-orange');
    medium.classList.remove('bg-yellow');
    low.classList.remove('bg-green');
}


function changeBgMedium(urgent, medium, low) {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium_white.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
    urgent.classList.remove('bg-orange');
    medium.classList.add('bg-yellow');
    low.classList.remove('bg-green');
}


function changeBgLow(urgent, medium, low) {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low_white.svg";
    urgent.classList.remove('bg-orange');
    medium.classList.remove('bg-yellow');
    low.classList.add('bg-green');
}


async function addTask() {
    let title = document.getElementById('title');
    let descripton = document.getElementById('descripton');
    let sector = liCategory; 
    let assingedTo = document.getElementById(liContact).innerHTML;
    let dueDate = document.getElementById('dueDate');
    let prioId = prio;

    let addTask = {
        "category" : 'to-do',
        "id": 0,
        "title": title.value,
        "description": descripton.value,
        "sector": sector,
        "assingedTo": assingedTo,
        "dueDate": dueDate.value,
        "prio": prioId,
    };

    task.push(addTask);

    saveOnServer();
    clearInput();
    createdTasks++;
}


async function saveOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('task', JSON.stringify(task));
}


function clearInput() {
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
    document.getElementById('selected-contact').innerHTML = 'Select contacts to assign';
    generateDate();

    prio = [];
}


function generateDate() {
    document.getElementById("dueDate").valueAsDate = new Date();
}


function showCategories() {
    let ulCategory = document.getElementById("ul-category");
    if (ulCategory.classList.contains('d-none')) {
        showSelectionCategories(ulCategory);
    }
    else {
        hideSelectionCategories(ulCategory);
    }
}


function showSelectionCategories(ulCategory) {
    ulCategory.classList.remove('d-none');
    document.getElementById("select-div-category").classList.add('no-border-bottom');
}


function hideSelectionCategories(ulCategory) {
    ulCategory.classList.add('d-none');
    document.getElementById("select-div-category").classList.remove('no-border-bottom');
}


function showContacts() {
    let ulContact = document.getElementById("ul-contact");
    if (ulContact.classList.contains('d-none')) {
        showSelectionContacts(ulContact);
    }
    else {
        hideSelectionContacts(ulContact);
    }
}


function showSelectionContacts(ulContact) {
    ulContact.classList.remove('d-none');
    document.getElementById("select-div-contact").classList.add('no-border-bottom');
}


function hideSelectionContacts(ulContact) {
    ulContact.classList.add('d-none');
    document.getElementById("select-div-contact").classList.remove('no-border-bottom');
}


function selectCategory(id) {
    liCategory = id.replace('div-', '');
    liCategory = liCategory.charAt(0).toUpperCase() + liCategory.slice(1);  
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


function selectContact(id) {
    liContact = id.replace('div-', '');
    let ulContact = document.getElementById("ul-contact");
    let contact = document.getElementById(id).innerHTML;
    showSelectedContacts(contact, liContact);
    showSelectionContacts(ulContact);
}


function showSelectedContacts(contact, liContact) {
    document.getElementById('selected-contact').style = 'display: flex; align-items: center; list-style-type: none;';
    document.getElementById("selected-contact").innerHTML = contact;
    document.getElementById("hidden-contact-input").value = '.';
    document.getElementById(liContact).style = 'margin:0; margin-right: 20px';
}


function showXandCheckmark() {
    if (twoSubtaskIcons == false) {
        document.getElementById('subtask-icons').innerHTML = /*html*/ `
        <img onclick="closeSubtask()" id="close-icon" src="../img/close-icon.png" alt="close">
        <img onclick="addSubtask()" id="checkmark-icon" src="../img/checkmark.png" alt="checkmark">`;
        document.getElementById('subtask-icons').style = 'width: 116px !important;'
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
    document.getElementById('subtask-icons').style = 'width: 50px;'
}


function addSubtask() {

}
