let downloadedTasks = [];
let existTasks = 0; // id assigner for downloaded Tasks. 
let currentDraggedElement;  // contains the ID of current dragged element
let NumberOfCurrentTasks = 0; // is needed to differ between the tasks
let currentClickedTask = 0;
let tasksOverview = [{
    "tasksOnBoard" : '',
    "tasksInTodo" : '',
    "tasksInProgress" : '', 
    'tasksInAwaitingFeedback' : '', 
    'tasksInDone' : '', 
    'urgentTasks' : '', 
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
}


async function loadTasksFromServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('downloadedTasks')) || [];

    console.log('loaded 123 tasks');
    console.log(downloadedTasks);

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
            pushIDtoTasks();
            document.getElementById('to-do').innerHTML += addTaskToKanbanHTML(element);
            createProgressbar(element); 
            createAssignedContacsOnBoard(element);
            NumberOfCurrentTasks++;
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

            pushIDtoTasks();
            document.getElementById('in-progress').innerHTML += addTaskToKanbanHTML(element);
            createProgressbar(element); 
            createAssignedContacsOnBoard(element);
            NumberOfCurrentTasks++;
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

            pushIDtoTasks();
            document.getElementById('awaiting-feedback').innerHTML += addTaskToKanbanHTML(element);
            createProgressbar(element); 
            createAssignedContacsOnBoard(element);
            NumberOfCurrentTasks++;
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

            pushIDtoTasks();
            document.getElementById('done').innerHTML += addTaskToKanbanHTML(element);
            createProgressbar(element); 
            createAssignedContacsOnBoard(element);
            NumberOfCurrentTasks++;
        }
    }
}

// function to allow dragging 
function allowDrop(ev) { // from W3School predefined // 
    ev.preventDefault();
}

/* 
function highlightDrag(id) {
    //document.getElementById(id).classList.add('drag-area-highlight'); 
    let div = document.getElementById(currentDraggedElement);
    let width = div.offsetWidth; 
    let height = div.offsetHeight; 

    console.log(width);
    console.log(height); 

        document.getElementById(id).innerHTML += `
        <div style="width:${width}px; height:${height}; background-color:blue"> 
        </div> 
    `; 
}
*/


function removeHightlightDrag(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}



// change the category to dropped task
function moveTo(category) {
    downloadedTasks[currentDraggedElement]['category'] = category;
    saveNewOnServer();
    displayAllTasks();


}


async function saveNewOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('downloadedTasks', JSON.stringify(downloadedTasks));
    await backend.setItem('tasksOverview', JSON.stringify(tasksOverview));
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
    console.log(search);

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
        console.log('openclickedtask wird nicht angezeigt'); 
    }
    document.getElementById('c-t-window').style.display = "flex";

    let actualSector = downloadedTasks[id]['sector'];

    actualSector = actualSector.charAt(0).toUpperCase() + actualSector.slice(1);

    displayClickedTaskHTML(id, actualSector);
    createSubtasks(id);
    createAssignedContacs(id);

    let classID = `c-t-category`
    let categoryID = `c-t-category-html`;
    let c = id;
    setColorTypeTasks(categoryID);
}


/** HTML Code for clicked Task
 * 
 *  all @param are explained in function "displayClickedTask()"
 */
function displayClickedTaskHTML(id, actualSector) {
    return document.getElementById('c-t-window').innerHTML = /*html*/`

    <div class="c-t-first-row"> 
        <div class="c-t-category" id="c-t-category"> 
            <span id="c-t-category-html">${actualSector}</span>
        </div>

        <div class="c-t-exit-arrow" onclick="hideClickedTask()"> 
            <img src="/Join-Gruppenarbeit/img/black-back-arrow.png"> 
        </div> 
    </div> 

    <div class="c-t-title" >
        <b>  ${downloadedTasks[id]['title']} </b>
    </div>

    <div class="c-t-description">
        <p> 
            ${downloadedTasks[id]['description']} 
        </p>
    </div>

    <div class="c-t-infos"> 
        <span>
            <b> 
                Subtasks:
            </b>
        </span>
    </div>

    <div class="c-t-subtasks" id="subtasks"> 
    </div> 

    <div class="c-t-infos"> 
        <span>
            <b>
                Due date:
            </b>
        </span>
        <span class="c-t-space"> 
        ${downloadedTasks[id]['dueDate']}
        </span> 
    </div>

    <div class="c-t-infos"> 
        <span>
            <b>
                Priority:
            </b>
        </span>
        <span class="c-t-space priority-box"> 
            ${downloadedTasks[id]['prio']} <img src="../img/arrow_urgent_white.svg" class="c-t-priority-icon"> 
        </span> 
    </div>

    <div class="c-t-infos"> 
        <span>
            <b>
                Assigned to:
            </b>
        </span>
    </div>

    <div class="c-t-assignedTo" id="c-t-assignedTo">
    </div> 
`;
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

        document.getElementById('c-t-assignedTo').innerHTML += `
        <div class="c-t-contact"> 
            <div class="c-t-profilimages"> 
                <span id="c-t-initials${i}">  
                </span> 
            </div> 
            <span>
                ${assignedContacts[i]}
            </span> 
        </div>
    `;

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

    console.log(initials);
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

    document.getElementById('subtasks').innerHTML = '';
    for (let i = 0; i < arrayOfSubtasks.length; i++) {

        let checked = '';

        if (arrayOfSubtasks[i]['checked'] === 'true') {
            checked = 'checked="true"'
        }
        else {
            checked = '';
        }

        document.getElementById('subtasks').innerHTML += `
            
        <label class="c-t-checkbox">
            <input type="checkbox" ${checked} id="subtask-id-${id}-${i}" onclick="updateCheckboxStatus(${i})"> 
            <span class="checkmark">${arrayOfSubtasks[i]['subtask']} </span> 
        </label>
        `
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

            document.getElementById(`assigned-employees-board-${element['id']}`).innerHTML += `
            <div class="c-t-profilimages" style="right:${pixels}px"> 
                <span id="initials-${element['id']}-${i}">  

                </span> 
            </div> 
            `;

            pixels += + 10;
        }
    }
    getFirstLetterMain(element);
}


/** filters the first letter of first and last name to display it on profilpictures on board site 
 * 
 * @param {string} element 
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



/** to hide the clickedTask
 * 
 */
function hideClickedTask() {
    document.getElementById('open-clicked-task').style.display = "none";
    document.getElementById('c-t-window').style.display = "none";

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
    document.getElementById('open-clicked-addtask').style.display = "flex";
    document.getElementById('c-t-addtask-window').style.display = "flex"
    generateDate();
}

/** to hide the add task window on board site
 * 
 */
function hideClickedAddTaskWindow() {

    document.getElementById('open-clicked-addtask').style.display = "none";
    document.getElementById('c-t-addtask-window').style.display = "none"
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
    startResponsiveBoardView(id, id2); 
}

    else {  //if not
        let id = '-responsive'; 
        let id2 = ''; 
        startResponsiveBoardView(id, id2); 
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



/** HTML to generate a task
 * 
 * @param {array} element - beinhaltet den gefilterten Array mit forschleifen Zahl der jeweiligen Kategorie.
 * 
 * 
 */
 function addTaskToKanbanHTML(element) { // element = task[0] or task[1] only filterd in category
    return `
    <div class="kanban-task-container" draggable="true" ondragstart="startDragging(${element['id']})" onclick="displayClickedTask(id)" id="${element['id']}">
    <div>
        <span class="task-type" id="task-type${NumberOfCurrentTasks}">${element['sector']}</span>
    </div>

    <div>
        <h3 class="kanban-task-title" ">
            ${element['title']}
        </h3>
    </div>

    <p class="task-description"> 
        ${element['description']}...
    </p>
    <div class="progress-section" id="progress-section-${element['id']}">
        <div class="progress-border" id="progressbar-${element['id']}">

        </div>

        <span id="progressbar-comparison-${element['id']}" class="progressbar-comparison">
        
         </span>
        </div>

    <div style="display:flex; justify-content: space-between; align-items:center; margin-top: 10px;">
        <div class="assigned-employees" id="assigned-employees-board-${element['id']}">

        </div>

        <img src="../img/arrow_low.svg">
    </div>
</div>
    `;
}
