// task will be filled with downloaded task and updated with new task, then upload again 
let downloadedTasks = [];
let newTask = []; // array to put new created task in
let prio = [];
let subtasks = [];
let contacts = [];
let actualPrio;
let createdTasks = 0;
let liCategory;
let liContact;
let twoSubtaskIcons = false;
let substasksJSON = [];



/**
 * checks if the input field from the subtask is checked, push subtask and if checked or not
 * in subtasksJSON
 */
function addSubtaskJSON() {
    for (let i = 1; i < subtasks.length + 1; i++) {
        let subtask = document.getElementById(`check-subtask-${i}`);
        let newTask = document.getElementById(`subtask-${i}`);
        if (subtask.checked) {
            let newSubtask = { subtask: newTask.innerHTML, checked: 'true' }
            substasksJSON.push(newSubtask);
        } else {
            let newSubtask = { subtask: newTask.innerHTML, checked: 'false' }
            substasksJSON.push(newSubtask);
        }
    }
}


/**
 * 
 * loads the page with the current date
 */
async function initAddTask() {
    await includeHTML();
    await loadTasksFromServer();
    generateDate();
    sidebarBgPage();
}


/**
 * empties the array prio and activates a function around the
 * to mark the urgency of the task
 * 
 * @param {string} id -Variable for the respective button
 */
function markedPrio(id) {
    prio = [];
    changeBg(id);
    document.getElementById("hidden-prio-input").value = '.';
}


/**
 * activates a function with the selected id
 * 
 * @param {string} id -Variable for the respective button
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
 * marks the priority of the task by changing the classes
 *
 * @param {*} urgent -stands for very important
 * @param {*} medium -stands for important
 * @param {*} low -stands for not so important
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
 * marks the priority of the task by changing the classes
 * 
 * @param {*} urgent -stands for very important
 * @param {*} medium -stands for important
 * @param {*} low -stands for not so important
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
 * marks the priority of the task by changing the classes
 * 
  * @param {*} urgent -stands for very important
 * @param {*} medium -stands for important
 * @param {*} low -stands for not so important
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
 * triggered by a button, the information entered is bundled in a JSON
 * pushed and functions for storing the JSON on the server are triggered
 * 
 */
async function addTask() {
    let title = document.getElementById('title');
    let descripton = document.getElementById('descripton');
    let dueDate = document.getElementById('dueDate');
    let sector = liCategory;
    pushContacts();
    pushPrio();
    addSubtaskJSON();
    setNewTask(title, descripton, sector, dueDate);
    saveOnServer();
    forwardToBoard();
    clearPage();
    createdTasks++;
}



function setNewTask(title, descripton, sector, dueDate) {
    newTask = {
        "category": 'to-do',
        "id": '',
        "title": title.value,
        "description": descripton.value,
        "sector": sector,
        "assingedTo": contacts,
        "dueDate": dueDate.value,
        "prio": actualPrio,
        "subtasks": substasksJSON
    };
    downloadedTasks.push(newTask);
}


function pushPrio() {
    let urgent = document.getElementById('prio-urgent');
    let medium = document.getElementById('prio-medium');
    let low = document.getElementById('prio-low');
    if (urgent.classList.contains('bg-orange')) {
        actualPrio = 'Urgent';
    }
    if (medium.classList.contains('bg-yellow')) {
        actualPrio = 'Medium';
    }
    if (low.classList.contains('bg-green')) {
        actualPrio = 'Low';
    }
    prio.push(actualPrio);
}



function pushContacts() {
    if (document.getElementById('checkbox-contact-1').checked) {
        contacts.push(document.getElementById('contact-1').innerHTML);
    }

    if (document.getElementById('checkbox-contact-2').checked) {
        contacts.push(document.getElementById('contact-2').innerHTML);
    }

    if (document.getElementById('checkbox-contact-3').checked) {
        contacts.push(document.getElementById('contact-3').innerHTML);
    }
}


/**
 * deletes the marking of the contact
 * 
 */
function clearContacts() {
    for (let i = 1; i < 4; i++) {
        document.getElementById(`checkbox-contact-${i}`).checked = false;
        document.getElementById(`initials-${i}`).classList.add('d-none');
    }
}


/**
 * after task was created, a information will be showed and then you will be forwarded to board.html
 */
function forwardToBoard() {
    let addedTask = document.getElementById('task-added-board');
    if (addedTask.classList.contains('d-none')) {
        addedTask.style.animation = 'fadeInAddedTask 0.8s ease-in-out';
        addedTask.classList.remove('d-none');
    }
    setTimeout(() => {
        window.location.href = '../html/board.html';
        addedTask.classList.add('d-none');
    }, 2000);
}


async function loadTasksFromServer() {
    setURL("https://sinan-fischer.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('downloadedTasks')) || [];
}


/**
 * save function on the server
 * 
 */
async function saveOnServer() {
    setURL("https://sinan-fischer.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('downloadedTasks', JSON.stringify(downloadedTasks));
}


/**
 * clears the input fields and entries
 * 
 */
function clearPage() {
    showDefaultPrioImgs();
    removeBgPrio();
    setValuesEmpty();
    document.getElementById('selected-category').innerHTML = 'Select task Category';
    document.getElementById('overview-subtasks').innerHTML = '';
    clearContacts();
    generateDate();
    prio = [];
    subtasks = [];
}


function setValuesEmpty() {
    let title = document.getElementById('title');
    let descripton = document.getElementById('descripton');
    let category = document.getElementById("hidden-category-input");
    let contact = document.getElementById("hidden-contact-input");
    let prio = document.getElementById("hidden-prio-input");
    title.value = '';
    descripton.value = '';
    category.value = '';
    contact.value = '';
    prio.value = '';
}



function showDefaultPrioImgs() {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
}



function removeBgPrio() {
    document.getElementById('prio-urgent').classList.remove('bg-orange');
    document.getElementById('prio-medium').classList.remove('bg-yellow');
    document.getElementById('prio-low').classList.remove('bg-green');
}


/**
 * loads the current date into the input field
 *
 */
function generateDate() {
    document.getElementById("dueDate").valueAsDate = new Date();
}


/**
 * by clicking on a button, a list with selections is shown
 * or hidden
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
 * a selection of categories is presented
 * 
 * @param {string} ulCategory -id of the respective category
 */
function showSelectionCategories(ulCategory) {
    ulCategory.classList.remove('d-none');
    document.getElementById("select-div-category").classList.add('no-border-bottom');
}


/**
 * a selection of categories is hidden
 * 
 * @param {string} ulCategory -Choice of categories
 */
function hideSelectionCategories(ulCategory) {
    ulCategory.classList.add('d-none');
    document.getElementById("select-div-category").classList.remove('no-border-bottom');
}


/**
 * a selection of contacts is shown
 * 
 * @param {string} ulContact -id of the contact container
 */
function showSelectionContacts(ulContact) {
    ulContact.classList.remove('d-none');
    document.getElementById("select-div-contact").classList.add('no-border-bottom');
}


/**
 * the selection of contacts disappears
 * 
 * @param {string} ulContact -id of the contact container
 */
function hideSelectionContacts(ulContact) {
    ulContact.classList.add('d-none');
    document.getElementById("select-div-contact").classList.remove('no-border-bottom');
}


/**
* Category selection function
 *
 * @param {string} id - selected category
 */
function selectCategory(id) {
    liCategory = id.replace('div-', '');
    let ulCategory = document.getElementById("ul-category");
    let category = document.getElementById(id).innerHTML;
    showSelectedCategory(category, liCategory);
    hideSelectionCategories(ulCategory);
}


/**
 * Function to make the selected category visible
 *
 * @param {string} category - selected category
 * @param {string} liCategory -replaced content from the id of the selected category
 */
function showSelectedCategory(category, liCategory) {
    document.getElementById('selected-category').style = 'display: flex; align-items: center; list-style-type: none;';
    document.getElementById("selected-category").innerHTML = category;
    document.getElementById("hidden-category-input").value = '.';
    document.getElementById(liCategory).style = 'margin:0; margin-right: 20px';
}


/**
* by clicking on a button, a list with selections is shown
 * or hidden
 * 
 */
function showContacts() {
    let ulContact = document.getElementById("ul-contact");
    if (ulContact.classList.contains('d-none')) {
        document.getElementById('all-contacts-initials').classList.add('d-none');
        showSelectionContacts(ulContact);
    }
    else {
        hideSelectionContacts(ulContact);
        document.getElementById('all-contacts-initials').classList.remove('d-none');
        if (document.getElementById("hidden-contact-input").value == '') {
            document.getElementById('all-contacts-initials').classList.add('d-none');
        }
    }
}



/**
 * function for selecting the contact
 * 
 * @param {string} id - selected contact
 */
function selectContact(id) {
    liContact = id.replace('div-', '');
    let ulContact = document.getElementById("ul-contact");
    showSelectionContacts(ulContact);
}


/**
 * verifies which contact has that box checked
 * @param {string} id - selected contact
 */
function proofCheck(id) {
    let isChecked = document.getElementById(id);
    let initial = id.replace('checkbox-contact', 'initials');

    let initial1 = document.getElementById('initials-1');
    let initial2 = document.getElementById('initials-2');
    let initial3 = document.getElementById('initials-3');

    setValueInitials(isChecked, initial, initial1, initial2, initial3)
}


function setValueInitials(isChecked, initial, initial1, initial2, initial3) {
    if (isChecked.checked == true) {
        document.getElementById(initial).classList.remove('d-none');
        document.getElementById("hidden-contact-input").value = '.';
    }
    else {
        document.getElementById(initial).classList.add('d-none');
    }

    if (noPersonSelected(initial1, initial2, initial3)) {
        document.getElementById("hidden-contact-input").value = '';
    }
}


function noPersonSelected(initial1, initial2, initial3) {
    return initial1.classList.contains('d-none') && initial2.classList.contains('d-none') && initial3.classList.contains('d-none')
}



/**
 * activates the option to add a subtask
 */
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


/**
 * includes the option to add a subtask
 */
function closeSubtask() {
    document.getElementById('subtask-input').value = '';
    document.getElementById('subtask-icons').innerHTML = /*html*/ `
    <img id="plus-icon" src="../img/plus-icon.png" alt="plus">`;
    twoSubtaskIcons = true;
}


/**
 * adds a subtask to the subtasks array and runs a function to display it for selection
 */
function addSubtask() {
    let newSubtask = document.getElementById('subtask-input');
    if (newSubtask.value.length >= 1) {
        subtasks.push(newSubtask.value);
        showAllSubtasks();
        closeSubtask();
    }
}


/**
 * Displays all subtasks from the subtasks array
 */
function showAllSubtasks() {
    let allSubtasks = document.getElementById('overview-subtasks');
    allSubtasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];

        allSubtasks.innerHTML += newSubtaskTemplate(i, subtask);
    }
}


/**
 * HTML part of function showAllSubtasks()
 * 
 * @param {string} i - instead of i
 * @param {string} subtask - subtask instead of i
 * @returns 
 */
function newSubtaskTemplate(i, subtask) {
    return /*html*/ `
        <div class="subtask-div">
                <input type="checkbox" id="check-subtask-${i + 1}">
                <span class="subtask" id="subtask-${i + 1}">${subtask}</span>
        </div>`;
}


