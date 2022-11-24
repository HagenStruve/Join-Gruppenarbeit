
let existTasks = 0; // id assigner for downloaded Tasks. 
let currentDraggedElement;  // contains the ID of current dragged element
let NumberOfCurrentTasks = 0; // is needed to differ between the tasks
let currentClickedTask = 0;
let editedNames = []; // needed for editing the contacts in clickedTask view  
let tasksOverview = [{
    "tasksOnBoard": '',
    "tasksInTodo": '',
    "tasksInProgress": '',
    'tasksInAwaitingFeedback': '',
    'tasksInDone': '',
    'urgentTasks': '',
}];


/** 
 * filters tasks-json and displays them assigned on board site
 * 
 * @param {string} todos - and other subvariables descripe the filter code to extract which task is in which category 
 * 
 * @param {string} element - tells html code which json array part need to be shown
 * 
 */

async function initBoard() {
    await includeHTML();
    renderBoardSite();
    checkResponsive();
    sidebarBgPage();

}


async function renderBoardSite() {
    await loadTasksFromServer();
    displayAllTasks();
    displayAllTasks(); // needed 2 times because id needed to assigned from  pushIDtoTasks. When only 1 time, error occurs, so dragging is not possible because all have the same id
}


async function loadTasksFromServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('downloadedTasks')) || [];
    users = JSON.parse(backend.getItem('users')) || [];

}


async function saveNewOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('downloadedTasks', JSON.stringify(downloadedTasks));
    await backend.setItem('tasksOverview', JSON.stringify(tasksOverview));
}

/** function switches add icon aside categorys to blue 
 * 
 * @param {string} id - contains id for add icon on boardview aside categorys (to-do / inProgres...) 
 */
function switchAddIcon(id) {
    document.getElementById(id).src = "../img/blue-plus.png"; 
}


/** function switches add icon aside categorys to black again 
 * 
 * @param {string} id - contains id for add icon on boardview aside categorys (to-do / inProgres...) 
 */
function switchAddIconBack(id) {
    document.getElementById(id).src = "../img/plus-icon-with-border.png"; 
}


/** updates the id from every task
 * 
 */
function pushIDtoTasks() {
    downloadedTasks[existTasks]['id'] = existTasks;
    existTasks++;
}



// function to allow dragging 
function allowDrop(ev) { // from W3School predefined // 
    ev.preventDefault();
}


function removeHightlightDrag(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


// change the category to dropped task
function moveTo(category) {
    downloadedTasks[currentDraggedElement]['category'] = category;
    saveNewOnServer();
    displayAllTasks();
}


// specify current dragged element
function startDragging(id) {
    currentDraggedElement = id;
}


/** Function assigns the corresponding colors to the appropriate categories
 * 
 * @param {string} innerHTML - variable checks what the task-category is
 *
 * @param {string} classID - hands over ID for Category Div to add the class specific color
 * 
 * @param {string} categoryID - hands over ID for HTHML inside Category Div  
 * 

 *  setColorCT does the same, but changes Color on clicked Task view
 */
function setColorTypeTasks(categoryID, classID) {
    for (let c = 0; c < NumberOfCurrentTasks; c++) {
        if (categoryID === classID) {
            setColor(categoryID, classID, c);
        }
        else {
            setColorCT(categoryID, classID, c);
        }
    }
}


/** responsible to set the correct color for the specific Category
 * 
 * @param {string} innerHTML - variable checks what the task-category is
 *
 * @param {string} classID - hands over ID for Category Div to add the class specific color
 * 
 * @param {string} categoryID - hands over ID for HTHML inside Category Div  
 */
function setColor(categoryID, classID, c) {

    let innerHTML = document.getElementById(`${categoryID}${c}`).innerHTML;
    let getID = document.getElementById(`${classID}${c}`);

    if (innerHTML === 'design') {
        getID.classList.add("orange");
    }
    if (innerHTML === 'sales') {
        getID.classList.add("pink");
    }
    if (innerHTML === 'backoffice') {
        getID.classList.add("cyan");
    }
    if (innerHTML === 'marketing') {
        getID.classList.add("blue");
    }
    if (innerHTML === 'media') {
        getID.classList.add("yellow");
    }
}

/** responsible to set the correct color for the specific Categor
 * 
 * ** setColor -CT - stands for "clicked task"
 * 
 * Why double? Try'd to do it in one function, because of some big differences in ID's it resolutioned
 * only in Errors and took to many time. So decided to do it simple and take the time for more important
 * work
 */
function setColorCT() {

    let innerHTML = document.getElementById('c-t-category-html').innerHTML;
    innerHTML = innerHTML.toLowerCase();
    let getID = document.getElementById('c-t-category');

    if (innerHTML === 'design') {
        getID.style.color = "rgba(255, 122, 0, 1)";
    }
    if (innerHTML === 'sales') {
        getID.style.background = " rgba(252, 113, 255, 1)";
    }
    if (innerHTML === 'backoffice') {
        getID.style.background = "rgba(31, 215, 193, 1)";
    }
    if (innerHTML === 'marketing') {
        getID.style.background = "rgba(0, 56, 255, 1)";
    }
    if (innerHTML === 'media') {
        getID.style.background = "rgba(255, 199, 1, 1)";
    }
}


/**gets Value of Input Field "search Task" and hands over to displayAllTasks() // which leads to display only tasks that match the search 
 * 
 * @param {string} search - contains value of input field "search Task"
 */
function searchTask() {
    let search = document.getElementById('input-search').value;
    search = search.toLowerCase();

    displayAllTasks(search); 
}


/** filters the first letter of first and last name to display it on profilpicture
 * 
 *  @param {string} assignedContact - path for all assigned contacts from specific task
 * 
 * @param {string} firstLetter - splits first and lastname in substrings and returns array,(split)
 *                               creates new array with first letter of each word (map)  
 *                               then use (join) to get back the array into a string.
 */
function getFirstLetter(id, i) {

    let assignedContact = downloadedTasks[id]['assingedTo'];

    let initials = assignedContact[i].split(' ').map(word => word.charAt(0)).join('');
    document.getElementById(`c-t-initials${i}`).innerHTML = `${initials}`;
}






/** filters the first letter of first and last name to display it on profilpictures on board site 
 * 
 * @param {array} element -  contains array path to current processing task 
 * 
 * @param {string} firstLetter - splits first and lastname in substrings and returns array,(split)
 *                               creates new array with first letter of each word (map)  
 *                               then use (join) to get back the array into a string.
 */
function getFirstLetterMain(element) {

    let assignedContacts = element['assingedTo'];

    for (let w = 0; w <= assignedContacts.length - 1; w++) {

        let initials = assignedContacts[w].split(' ').map(word => word.charAt(0)).join('');
        document.getElementById(`initials-${element['id']}-${w}`).innerHTML = `${initials}`;

    }
}



/** to hide the ADDTask board menu!
 * 
 */
function hideClickedAddTask() {
    document.getElementById('open-clicked-task').style = 'display: none;';
    document.getElementById('c-t-addtask-window').style.animation = 'fadeOutTask 1s ease-in-out';
    setTimeout(() => {
        document.getElementById('c-t-addtask-window').style = 'display: none;';
    }, 800);
}


/**
 * loads the current date into the input field
 *
 */
function generateDate() {
    document.getElementById("dueDate").valueAsDate = new Date();
}


/** to show the add task window on board site
 * 
 */
function displayAddTaskWindow() {
    document.getElementById('c-t-addtask-window').style.display = "flex";
    document.getElementById('open-clicked-task').style.display = "flex";
    generateDate();
}


let myMediaQuery1400 = window.matchMedia('(min-width: 1400px)');
let myMediaQuery570 = window.matchMedia('(min-width:570px)');
myMediaQuery1400.addListener(checkResponsive); // addListener prüft bei änderung der Bildschirmgröße ob mediaQuerry noch zutrifft oder nicht

/** starts the needed view related html code for responsive 
 * 
 *  @param {string} id - needed to difference between create responsive and delete
 * 
 *  @param {string} id2 - needed to difference between create responsive and delete ( needed reversed)
 */
function checkResponsive() {
    if (myMediaQuery1400.matches) { //if higher than 1400px
        let id = '';
        let id2 = '-responsive';
       // startResponsiveBoardView(id, id2);
       generateSearchFieldHTML(id);
       deleteSearchFíeldHTML(id2); 
       document.getElementById("kanban-overview").style.flexDirection = "row";
    }

    else {  //if not
        let id = '-responsive';
        let id2 = '';
        //startResponsiveBoardView(id, id2);
        generateSearchFieldHTML(id);
        deleteSearchFíeldHTML(id2); 
        document.getElementById("kanban-overview").style.flexDirection = "column";
    }

}


function generateSearchFieldHTML(id) {
    return document.getElementById(`find-task${id}`).innerHTML = `
        <div class="find-task-div">
            <input placeholder="Find Task" class="find-task-input" id="input-search" onkeyup="searchTask()">
            <img src="../img/magnifying-glass.png">
        </div> `;
}


/** deletes content for responsive, so that only the desktop or mobile content is displayed
 * 
 */
 function deleteSearchFíeldHTML(id2) {
    document.getElementById(`find-task${id2}`).innerHTML = '';
}



function editContacts(name) {
    editedNames.push(name);
}






/* ||| Functions below are copied from addTask.js // JS wollte sich nicht mit der anderen Datei verbinden
    \/
    ||
    \/


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
        if (noSelectedContacts()) {
            document.getElementById('all-contacts-initials').classList.add('d-none');
        }
    }
}

function noSelectedContacts() {
    return document.getElementById("hidden-contact-input").value == ''
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
 * verifies which contact has that box checked
 * @param {string} id - selected contact
 */
function proofCheck(id) {
    let isChecked = document.getElementById(id);
    let initial = id.replace('checkbox-contact', 'initials');

    let initial1 = document.getElementById('initials-1');
    let initial2 = document.getElementById('initials-2');
    let initial3 = document.getElementById('initials-3');

    showOrHideInitials(isChecked, initial, initial1, initial2, initial3);
}


function showOrHideInitials(isChecked, initial, initial1, initial2, initial3) {
    if (isChecked.checked == true) {
        showInitials(initial);
    }
    else {
        hideInitials(initial);
    }

    if (initial1.classList.contains('d-none') && initial2.classList.contains('d-none') && initial3.classList.contains('d-none')) {
        document.getElementById("hidden-contact-input").value = '';
    }
}


function showInitials(initial) {
    document.getElementById(initial).classList.remove('d-none');
    document.getElementById("hidden-contact-input").value = '.';
}


function hideInitials(initial) {
    document.getElementById(initial).classList.add('d-none');
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