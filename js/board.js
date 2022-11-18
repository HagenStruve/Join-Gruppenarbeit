let downloadedTasks = [];
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
    displayAllTasks();
}


async function loadTasksFromServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('downloadedTasks')) || [];

    console.log('loaded 123 tasks');
    console.log(downloadedTasks);
}


async function saveNewOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('downloadedTasks', JSON.stringify(downloadedTasks));
    await backend.setItem('tasksOverview', JSON.stringify(tasksOverview));
}


function switchAddIcon(id) {
    document.getElementById(id).src = "../img/blue-plus.png"; 
}


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



/** Shows all Tasks on Website 
 * 
 * @param NumberOfCurrentTasks -// is needed to differ between the tasks and to assign the colors to the tasks
 */
function displayAllTasks(search) {
    tasksOverview[0]['tasksOnBoard'] = downloadedTasks.length;
    NumberOfCurrentTasks = 0;
    existTasks = 0;
    displayToDos(search);
    displayInProgressTasks(search);
    displayAwaitingFeedbackTasks(search);
    displayDoneTasks(search);

    let titleID = 'task-type';
    let classID = 'task-type';
    setColorTypeTasks(titleID, classID);
}

/** displays all todos in HTML 
 * 
 * @param {string} todos - variable contains all arrays which have the category "to-do"
 * 
 * @param {Array} search - contains every letter that typed in input field "find task"
 * 
 * @param {number} percentageFinishedSubtasks - contains number of percentage of finished subtasks

 */
function displayToDos(search) {
    let todos = downloadedTasks.filter(t => t['category'] == 'to-do');
    tasksOverview[0]['tasksInTodo'] = todos.length;
    document.getElementById('to-do').innerHTML = '';

    for (let i = 0; i < todos.length; i++) {
        let title = todos[i]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            // wenn es search nicht gibt dann führe aus, und wenn title etwas von der suche beinhaltet dann führe ebenfalls aus, wenn nicht dann zeigt er auch nichts an 
            const element = todos[i];

            let category = 'to-do';
            createTask(element, category);
        }
    }
}


function displayInProgressTasks(search) {
    let inProgress = downloadedTasks.filter(t => t['category'] == 'in-progress');
    tasksOverview[0]['tasksInProgress'] = inProgress.length;
    document.getElementById('in-progress').innerHTML = '';

    for (let p = 0; p < inProgress.length; p++) {
        let title = inProgress[p]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = inProgress[p];

            let category = 'in-progress';
            createTask(element, category);
        }
    }
}


function displayAwaitingFeedbackTasks(search) {
    let awaitingFeedback = downloadedTasks.filter(t => t['category'] == 'awaiting-feedback');
    tasksOverview[0]['tasksInAwaitingFeedback'] = awaitingFeedback.length;
    document.getElementById('awaiting-feedback').innerHTML = '';

    for (let a = 0; a < awaitingFeedback.length; a++) {
        let title = awaitingFeedback[a]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = awaitingFeedback[a];

            let category = 'awaiting-feedback';
            createTask(element, category);
        }
    }
}


function displayDoneTasks(search) {
    let done = downloadedTasks.filter(t => t['category'] == 'done');
    tasksOverview[0]['tasksInDone'] = done.length;
    document.getElementById('done').innerHTML = '';

    for (let d = 0; d < done.length; d++) {
        let title = done[d]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = done[d];
            let category = 'done';
            createTask(element, category);
        }
    }
}


function createTask(element, category) {
    pushIDtoTasks();
    document.getElementById(category).innerHTML += addTaskToKanbanHTML(element);
    createProgressbar(element);
    createAssignedContacsOnBoard(element);
    displayImportanceStatusBoard(element);
    NumberOfCurrentTasks++;
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


/** displays the associated importance on Clicked Task view
 */
function displayImportanceStatusCT() {
    element = downloadedTasks[currentClickedTask];
    let importanceId = document.getElementById(`importance-id-c-t-${currentClickedTask}`);
    let white = "_white";
    displayImportanceStatus(element, importanceId, white);
    SetimportanceColorCT(element);
}


/** displays the associated importance on board view
 * 
 * @param {array} element -  contains id from currently processed task
 */
function displayImportanceStatusBoard(element) {
    let importanceId = document.getElementById(`importance-id-${element['id']}`);
    let white = '';
    displayImportanceStatus(element, importanceId, white);
}


/**  Displays the importance status from task on board 
 * 
 * @param {array} element - contains id from currently processed task
 * @param {string} importanceId - contains id to get to wished idElement
 * @param {string} white - on board view symbols are not white, on clickedTask view they are 
 */
function displayImportanceStatus(element, importanceId, white) {

    if (element['prio'] == 'Urgent') {
        importanceId.src = `../img/arrow_urgent${white}.svg`;
    }
    if (element['prio'] == 'Medium') {
        importanceId.src = `../img/medium${white}.svg`;
    }
    if (element['prio'] == 'Low') {
        importanceId.src = `../img/arrow_low${white}.svg`;
    }
}


/** changes the color to specific importance on clickedTask view
 * 
 * @param {array} element -  contains id from currently clicked task
 */
function SetimportanceColorCT(element) {
    let priorityBox = document.getElementById('priority-box-c-t');
    if (element['prio'] == 'Urgent') {
        priorityBox.style.background = "#FF3D00";
    }
    if (element['prio'] == 'Medium') {
        priorityBox.style.background = "#FFA800";
    }
    if (element['prio'] == 'Low') {
        priorityBox.style.background = "#7AE229";
    }
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

    displayAllTasks(search)
}


/** shows a bigger window of the Task, when it's clicked
 * 
 * @param {number} id - contains number id which task is clicked
 * 
 * @param {string} actualSector - contains category like "marketing" or "backend"l
 */
function displayClickedTask(id) {
    currentClickedTask = id;
    document.getElementById('open-clicked-task').style.display = "flex";
    if (!myMediaQuery570.matches) {
        document.getElementById('open-clicked-task').style.display = "none";
    }
    document.getElementById('c-t-window').style.display = "flex";
    createClickedTaskView(id);
}


function createClickedTaskView(id) {
    let actualSector = downloadedTasks[id]['sector'];
    actualSector = actualSector.charAt(0).toUpperCase() + actualSector.slice(1);

    displayClickedTaskHTML(id, actualSector);
    createSubtasks(id);
    createAssignedContacs(id);
    displayImportanceStatusCT();

    let categoryID = `c-t-category-html`;
    setColorTypeTasks(categoryID);
}


/** creates html code to show the assigned contacts on clicked task
 * 
 * @param {number} id - contains id (number) of current selected task 
 * 
 */
function createAssignedContacs(id) {
    document.getElementById('c-t-assignedTo').innerHTML = '';

    let assignedContacts = downloadedTasks[id]['assingedTo'];
    for (let i = 0; i < assignedContacts.length; i++) {

        createAssignedContacsHTML(i, assignedContacts);
        getFirstLetter(id, i);
    }
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




/** get the subtasks from downloaded serverarray and adds them in clicked task view (html code)
 * 
 * @param {number}  numberOfSubtasks - gets the amount of subtasks as number
 * 
 * @param {number} id - is the same like downloadedTasks[x]['id']
 * 
 */
function createSubtasks(id) {

    let arrayOfSubtasks = downloadedTasks[id]['subtasks'];

    if (arrayOfSubtasks.length === 0) {
        document.getElementById('subtask-section').style.display = "none";
    }
    else {
        document.getElementById('subtask-section').style.display = "block";
        document.getElementById('subtasks').innerHTML = '';
        CheckCheckboxandCreateSubtasks(id, arrayOfSubtasks);
    }
}


/** function checks if checkbox needs to display checked or not and calls function to create subtasks html
 * 
 * @param {number} id - contains id of current clicked task 
 * @param {*} arrayOfSubtasks - contains "downloadedTasks[id]['subtasks']"
 */
function CheckCheckboxandCreateSubtasks(id, arrayOfSubtasks) {
    for (let i = 0; i < arrayOfSubtasks.length; i++) {

        let checked = '';

        if (arrayOfSubtasks[i]['checked'] === 'true') {
            checked = 'checked="true"'
        }
        else {
            checked = '';
        }
        createSubtasksHTML(id, i, checked, arrayOfSubtasks);
    }
}


/** function gets the new value typed in the editMenu from clicked task  
 * 
 */
function getNewValueFromEditedTask() {
    let newTitle = document.getElementById('c-t-title-edit').value;
    let newDescription = document.getElementById('c-t-description-edit').value;
    let newDate = document.getElementById('c-t-date-edit').value;

    downloadedTasks[currentClickedTask]['title'] = newTitle;
    downloadedTasks[currentClickedTask]['description'] = newDescription;
    downloadedTasks[currentClickedTask]['dueDate'] = newDate;
    downloadedTasks[currentClickedTask]['assingedTo'] = editedNames;
    editedNames = []; // clears array for new edit 
    let id = currentClickedTask;
    displayClickedTask(id);
    displayAllTasks();
}


/** function highlights and delights the prios in editmenu from clicked task
 * 
 * @param {string} prio - contains urgent/medium or low, selected from edit menu clicked task
 */
function markedPrioCT(prio) {
    let urgentID = document.getElementById('prio-urgent-c-t-edit');
    let mediumID = document.getElementById('prio-medium-c-t-edit')
    let lowID = document.getElementById('prio-low-c-t-edit');
    if (prio == 'Urgent') {
        downloadedTasks[currentClickedTask]['prio'] = prio;
        selectUrgentEdit(urgentID, mediumID, lowID);
    }
    if (prio == 'Medium') {
        downloadedTasks[currentClickedTask]['prio'] = prio;
        selectMediumEdit(urgentID, mediumID, lowID);
    }
    if (prio == 'Low') {
        downloadedTasks[currentClickedTask]['prio'] = prio;
        selectLowEdit(urgentID, mediumID, lowID);
    }
}


/** function highlighting prio in edit task view
 * 
 * @param {string} urgentID - this and the other id variabels contains getElementID from specific prio
 */
function selectUrgentEdit(urgentID, mediumID, lowID) {
    urgentID.style.background = "#FF3D00";
    document.getElementById('prio-urgent-c-t-edit-img').src = "../img/arrow_urgent_white.svg";
    document.getElementById('prio-medium-c-t-edit-img').src = "../img/medium.svg";
    document.getElementById('prio-low-c-t-edit-img').src = "../img/arrow_low.svg";
    setClickedStats(urgentID);
    setStatsBack(lowID);
    setStatsBack(mediumID);
}

/** function highlighting prio in edit task view
 */
function selectMediumEdit(urgentID, mediumID, lowID) {
    mediumID.style.background = "#FFA800";
    document.getElementById('prio-medium-c-t-edit-img').src = "../img/medium_white.svg";
    document.getElementById('prio-urgent-c-t-edit-img').src = "../img/arrow_urgent.svg"; // urgent setzt zurück
    document.getElementById('prio-low-c-t-edit-img').src = "../img/arrow_low.svg"; // low setzt zurück
    setClickedStats(mediumID);
    setStatsBack(urgentID);
    setStatsBack(lowID);
}

/** function highlighting prio in edit task view
 */
function selectLowEdit(urgentID, mediumID, lowID) {
    lowID.style.background = "#7AE229";
    document.getElementById('prio-low-c-t-edit-img').src = "../img/arrow_low_white.svg";
    document.getElementById('prio-urgent-c-t-edit-img').src = "../img/arrow_urgent.svg"; // urgent setzt zurück
    document.getElementById('prio-medium-c-t-edit-img').src = "../img/medium.svg";
    setClickedStats(lowID);
    setStatsBack(urgentID);
    setStatsBack(mediumID);
}




/** sets clicked prios css classes in edited task view
 * 
 * @param {string} prioID - contains getElementID from specific prio
 */
function setClickedStats(prioID) {
    prioID.style.fontWeight = "bold";
    prioID.style.color = "white";
}

/** sets clicked prios back in edited task view
 * 
 * @param {string} prioID - contains getElementID from specific prio
 */
function setStatsBack(prioID) {
    prioID.style.background = "white";
    prioID.style.fontWeight = "400";
    prioID.style.color = "black";
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



/** saves the new status of subtask (checkbox) when clicked
 * 
 * @param {string} i - contains i-value from function createSubtasks to be able to access the under subtask
 */
function updateCheckboxStatus(i) {
    let checkbox = document.getElementById(`subtask-id-${currentClickedTask}-${i}`);
    let arrayOfSubtasks = downloadedTasks[currentClickedTask]['subtasks'];

    if (checkbox.checked) {
        arrayOfSubtasks[i]['checked'] = 'true';
    }
    else {
        arrayOfSubtasks[i]['checked'] = 'false';
    }

    saveNewOnServer();
    displayAllTasks();
}


/** creates the divs for assignedContacts view on Boardsite
 * 
 * @param {string} element - hands over from display function - contains currently task like 
 *                         - downloadedTask[0]  
 *  
 * @param {number} x  -created to prevent more than 3 assigned contacts being created on the board site
 * 
 */
function createAssignedContacsOnBoard(element) {
    document.getElementById(`assigned-employees-board-${element['id']}`).innerHTML = '';

    let x = element['assingedTo'].length;
    let pixels = 0;

    if (x > 3) {
        x = 2;
    }
    else {
        for (i = 0; i <= x - 1; i++) {
            createAssignedContacsOnBoardHTML(element, pixels);
            pixels += + 10;
        }
    }
    getFirstLetterMain(element);
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


/** creates progressbar
 * 
 * @param {array} element  - contains array path to current processing task 
 */
function createProgressbar(element) {
    if (element['subtasks'].length == 0) {
        document.getElementById(`progress-section-${element['id']}`).innerHTML = '';
    }
    else {
        calculateProgressBar(element);
    }

}


/** calculates the percentage for progressbar in tasks on kanban
 * 
 * 
 */
function calculateProgressBar(element) {
    let numberOfSubtasks = element['subtasks'].length;
    let finishedSubstasksArray = element['subtasks'].filter(t => t['checked'] == 'true');
    let finishedSubstasks = finishedSubstasksArray.length;
    let percentageFinishedSubtasks = finishedSubstasks / numberOfSubtasks * 100;

    document.getElementById(`progressbar-${element['id']}`).innerHTML = `
        <div class="gray" style=" height: 6px; width:${percentageFinishedSubtasks}%; border-radius:15px"> 
        </div>
    `;
    numberProgressBar(element, numberOfSubtasks, finishedSubstasks);
}


/** shows how many subtasks are completed and how many not
 */
function numberProgressBar(element, numberOfSubtasks, finishedSubstasks) {
    document.getElementById(`progressbar-comparison-${element['id']}`).innerHTML = `
             ${finishedSubstasks}/${numberOfSubtasks} Done 
    `;
}

/** function needed to get back from clicked Task
 * 
 */
function hideClickedTask() {
    document.getElementById('open-clicked-task').style.display = "none";
    document.getElementById('c-t-window').style.display = "none";
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


/** function renders site, in order to display new added Tasks
 * 
 */
async function newTaskReload() {
    await addTask();
    renderBoardSite();
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
       document.getElementById("kanban-overview").style.flexDirection = "row";
    }

    else {  //if not
        let id = '-responsive';
        let id2 = '';
        //startResponsiveBoardView(id, id2);
        document.getElementById("kanban-overview").style.flexDirection = "column";
    }

}

/** let all function start, that are needed for responsive view
 * 
 */
function startResponsiveBoardView(id, id2) {
    deleteDesktopBoardView(id2);
    generateResponsiveHTMLCode(id);
    displayAllTasks();
}


/** generates needed HTML Code on location.
 * 
 */
function generateResponsiveHTMLCode(id) {
    document.getElementById(`to-do${id}`).innerHTML = `
        <div class="current-status" id="to-do" ondrop="moveTo('to-do')" ondragover="allowDrop(event)">
        </div>`;
    document.getElementById(`in-progress${id}`).innerHTML = `
        <div class="current-status" id="in-progress" ondrop="moveTo('in-progress')" ondragover="allowDrop(event) ">
        </div> `;
    document.getElementById(`awaiting-feedback${id}`).innerHTML = `
        <div class="current-status" id="awaiting-feedback" ondrop="moveTo('awaiting-feedback') "ondragover="allowDrop(event)">
        </div> `;
    document.getElementById(`done${id}`).innerHTML = `
        <div class="current-status" id="done" ondrop="moveTo('done')" ondragover="allowDrop(event)">
        </div> `;
    searchFieldHTML(id);
}


function searchFieldHTML(id) {
    return document.getElementById(`find-task${id}`).innerHTML = `
        <div class="find-task-div">
            <input placeholder="Find Task" class="find-task-input" id="input-search" onkeyup="searchTask()">
            <img src="../img/magnifying-glass.png">
        </div> `;
}


/** deletes content for responsive, so that only the desktop or mobile content is displayed
 * 
 */
function deleteDesktopBoardView(id2) {
    document.getElementById(`to-do${id2}`).innerHTML = '';
    document.getElementById(`in-progress${id2}`).innerHTML = '';
    document.getElementById(`awaiting-feedback${id2}`).innerHTML = '';
    document.getElementById(`done${id2}`).innerHTML = '';
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


