let downloadedTasks = [];
let existTasks = 0; // id assigner for downloaded Tasks. 
percentageFinishedSubtasks = 0; // needed! Will be changed in every displayTask function
let currentDraggedElement;  // contains the ID of current dragged element
let NumberOfCurrentTasks = 0; // is needed to differ between the tasks

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
}

async function loadTasksFromServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('downloadedTasks')) || [];

    console.log('loaded 123 tasks');
    console.log(downloadedTasks);

}


function pushIDtoTasks() {
    let idTask = downloadedTasks[existTasks]['id']; 
    if (idTask === 0) {
        downloadedTasks[existTasks]['id'] = existTasks; 
        existTasks++; 
    }
        else {
            console.log(`Task Nummer: ${existTasks} ist bereits eine ID zugewiesen`); 
        }
}


/** generates and pushes ID to downloaded tasks, which is needed to drag
 * 
 * 
 */
function createIdForTasks() {

}


async function renderBoardSite() {
    await loadTasksFromServer();
    displayAllTasks();
}


/** Shows all Tasks on Website 
 * 
 * @param NumberOfCurrentTasks -// is needed to differ between the tasks and to assign the colors to the tasks
 */
function displayAllTasks(search) {
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
    document.getElementById('to-do').innerHTML = '';


    for (let i = 0; i < todos.length; i++) {
        let title = todos[i]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            // wenn es search nicht gibt dann führe aus, und wenn title etwas von der suche beinhaltet dann führe ebenfalls aus, wenn nicht dann zeigt er auch nichts an 

            const element = todos[i];
            pushIDtoTasks(); 
            calculateProgressBar(element);
            document.getElementById('to-do').innerHTML += addTaskToKanbanHTML(element);
            getFirstLetterMain(element);
            NumberOfCurrentTasks++;
        }
    }
}


function displayInProgressTasks(search) {
    let inProgress = downloadedTasks.filter(t => t['category'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';

    for (let p = 0; p < inProgress.length; p++) {
        let title = inProgress[p]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = inProgress[p];

            pushIDtoTasks();             
            calculateProgressBar(element);
            document.getElementById('in-progress').innerHTML += addTaskToKanbanHTML(element);
            getFirstLetterMain(element);
            NumberOfCurrentTasks++;
        }
    }
}


function displayAwaitingFeedbackTasks(search) {
    let awaitingFeedback = downloadedTasks.filter(t => t['category'] == 'awaiting-feedback');
    document.getElementById('awaiting-feedback').innerHTML = '';

    for (let a = 0; a < awaitingFeedback.length; a++) {
        let title = awaitingFeedback[a]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = awaitingFeedback[a];

            pushIDtoTasks(); 
            calculateProgressBar(element);
            document.getElementById('awaiting-feedback').innerHTML += addTaskToKanbanHTML(element);
            getFirstLetterMain(element);
            NumberOfCurrentTasks++;
        }
    }
}

function displayDoneTasks(search) {
    let done = downloadedTasks.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = '';

    for (let d = 0; d < done.length; d++) {
        let title = done[d]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = done[d];

            pushIDtoTasks(); 
            calculateProgressBar(element);
            document.getElementById('done').innerHTML += addTaskToKanbanHTML(element);
            getFirstLetterMain(element);
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


function removeHightlightDrag(id) {
    document.getElementById(id).classList.remove('drag-area-highlight'); 
}

*/ 


// change the category to dropped task
function moveTo(category) {
    downloadedTasks[currentDraggedElement]['category'] = category;
    displayAllTasks();
    saveNewOnServer();

}


async function saveNewOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('task', JSON.stringify(downloadedTasks));
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

    document.getElementById('open-clicked-task').style.display = "flex";
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
    <div class="c-t-category" id="c-t-category"> 
        <span id="c-t-category-html">${actualSector}</span>
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

        document.getElementById(`initials${w}`).innerHTML = `${initials}`;

    }
}


/** get the subtasks from downloaded serverarray and adds them in clicked task view (html code)
 * 
 * @param {number}  numberOfSubtasks - gets the amount of subtasks as number
 * 
 */
function createSubtasks(id) {

    let arrayOfSubtasks = downloadedTasks[id]['subtasks'];

    document.getElementById('subtasks').innerHTML = '';
    for (let i = 0; i < arrayOfSubtasks.length; i++) {

        document.getElementById('subtasks').innerHTML += `
            
        <label class="c-t-checkbox">
            <input type="checkbox" checked > 
            <span class="checkmark">${arrayOfSubtasks[i]} </span> 
        </label>
        `
    }
}


/** calculates the percentage for progressbar in tasks on kanban
 * 
 * 
 */
function calculateProgressBar() {
    let numberOfSubtasks = downloadedTasks[0]['subtasks'];
    let finishedSubstasks = downloadedTasks[0]['checked'];

    percentageFinishedSubtasks = finishedSubstasks / numberOfSubtasks * 100;

    console.log('Die prozentanzahl ist ', percentageFinishedSubtasks);
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


/** HTML to generate a task
 * 
 * @param {array} element - beinhaltet den gefilterten Array mit forschleifen Zahl der jeweiligen Kategorie.
 * 
 * @returns 
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
    <div class="progress-section">
        <div class="progress-border">
            <div class="gray" style=" height: 6px; width:${percentageFinishedSubtasks}%; border-radius:15px"> </div>
        </div>

        <span style="font-size: 13px; font-weight: 500; text-align: center"> 1/2 Done </span>
    </div>

    <div
        style="display:flex; justify-content: space-between; align-items:center; margin-top: 10px;">
        <div class="assigned-employees">

                <div class="c-t-profilimages"> 
                    <span id="initials0">  
                        funkt
                    </span> 
                </div> 

                <div class="c-t-profilimages second-picture" >
                    <span id="initials1">  
                        
                    </span> 
                </div> 
                
                <div class="c-t-profilimages third-picture">
                    <span id="initials2">  
                       
                    </span> 
                </div> 

        </div>

        <img src="../img/arrow_low.svg">
    </div>
</div>
    `;
}


