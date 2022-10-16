

let tasks = [{
    'id': 0,
    'sector': 'Media',
    'title': 'Redesign Website',
    'description': 'Modify contents of the website und und und nur ein Testtext',
    'subtasks': 2,
    'assignedTo': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'urgent',
    'category': 'to-do'
},
{
    'id': 1,
    'sector': 'Sales',
    'title': 'Call Clients',
    'description': 'Sells so much that we drown in money',
    'subtasks': 0,
    'assignedTo': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'in-progress'
},
{
    'id': 2,
    'sector': 'Backoffice',
    'title': 'Do Something',
    'description': 'and teaches them good things',
    'subtasks': 0,
    'assignedTo': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'awaiting-feedback'
},
{
    'id': 3,
    'sector': 'Marketing',
    'title': 'Sell Products',
    'description': 'Market yourself so well that you dont need marketing anymore',
    'subtasks': 0,
    'assignedTo': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'done'
}];


let downloadedTasks = [];

let tasksOnServer = {
    "id" : 0,
    "title": '',
    "descripton": '',
    "category": '',
    "assingedTo": '',
    "dueDate": '',
    "importance": '',
};

let currentDraggedElement;
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
    await renderBoardSite();
    loadTasksFromServer();
}

async function loadTasksFromServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('task')) || [];

    console.log('loaded 123 tasks');
    console.log(downloadedTasks);

}


async function renderBoardSite() {
    // await loadTasksFromServer();
    displayAllTasks();
}


/** Shows all Tasks on Website 
 * 
 * @param NumberOfCurrentTasks -// is needed to differ between the tasks and to assign the colors to the tasks
 */
function displayAllTasks(search) {
    NumberOfCurrentTasks = 0;
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

 */
function displayToDos(search) {
    let todos = tasks.filter(t => t['category'] == 'to-do');
    document.getElementById('to-do').innerHTML = '';


    for (let i = 0; i < todos.length; i++) {
        let title = todos[i]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            // wenn es search nicht gibt dann führe aus, und wenn title etwas von der suche beinhaltet dann führe ebenfalls aus, wenn nicht dann zeigt er auch nichts an 

            const element = todos[i];

            document.getElementById('to-do').innerHTML += addTaskToKanbanHTML(element);
            NumberOfCurrentTasks++;
        }
    }
}


function displayInProgressTasks(search) {
    let inProgress = tasks.filter(t => t['category'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';

    for (let p = 0; p < inProgress.length; p++) {
        let title = inProgress[p]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = inProgress[p];

            document.getElementById('in-progress').innerHTML += addTaskToKanbanHTML(element);
            NumberOfCurrentTasks++;
        }
    }
}


function displayAwaitingFeedbackTasks(search) {
    let awaitingFeedback = tasks.filter(t => t['category'] == 'awaiting-feedback');
    document.getElementById('awaiting-feedback').innerHTML = '';

    for (let a = 0; a < awaitingFeedback.length; a++) {
        let title = awaitingFeedback[a]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = awaitingFeedback[a];

            document.getElementById('awaiting-feedback').innerHTML += addTaskToKanbanHTML(element);
            NumberOfCurrentTasks++;
        }
    }
}

function displayDoneTasks(search) {
    let done = tasks.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = '';

    for (let d = 0; d < done.length; d++) {
        let title = done[d]['title'].toLowerCase();
        if (!search || title.includes(search)) {
            const element = done[d];

            document.getElementById('done').innerHTML += addTaskToKanbanHTML(element);
            NumberOfCurrentTasks++;
        }
    }
}

// function to allow dragging 
function allowDrop(ev) { // from W3School predefined // 
    ev.preventDefault();
}


// change the category to dropped task
function moveTo(category) {
    tasks[currentDraggedElement]['category'] = category;
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

 * 
 */
function setColorTypeTasks(categoryID, classID) {
    for (let c = 0; c < NumberOfCurrentTasks; c++) {
        setColor(categoryID, classID, c); 
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

    if (innerHTML === 'Design') {
        getID.classList.add("orange");
    }
    if (innerHTML === 'Sales') {
        getID.classList.add("pink");
    }
    if (innerHTML === 'Backoffice') {
        getID.classList.add("cyan");
    }
    if (innerHTML === 'Marketing') {
        getID.classList.add("blue");
    }
    if (innerHTML === 'Media') {
        getID.classList.add("yellow");
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
 */
function displayClickedTask(id) {

    document.getElementById('open-clicked-task').style.display = "flex";

    document.getElementById('c-t-window').innerHTML = `
        <div class="c-t-category" id="c-t-category${id}"> 
            <span id="c-t-category-html${id}">${tasks[id]['category']}</span>
        </div>

        <div class="c-t-title" >
            <b>  ${tasks[id]['title']} </b>
        </div>

        <div class="c-t-description">
            <p> 
                ${tasks[id]['description']} 
            </p>
        </div>

        <div class="c-t-infos"> 
            <span>
                <b>
                    Due date:
                </b>
            </span>
            <span class="c-t-space"> 
                05-08-2022
            </span> 
        </div>

        <div class="c-t-infos"> 
            <span>
                <b>
                    Priority:
                </b>
            </span>
            <span class="c-t-space priority-box"> 
                ${tasks[id]['importance']} <img src="/img/urgent-white.png" class="c-t-priority-icon"> 
            </span> 
        </div>

        <div class="c-t-infos"> 
            <span>
                <b>
                    Assigned to:
                </b>
            </span>
        </div>

        <div class="c-t-assignedTo">
            <div class="c-t-contact"> 
                <img src="/img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png" class="c-t-profilimages"> 
                <span>
                    Sarah Eisenberg
                </span> 
            </div>

            <div class="c-t-contact"> 
                <img src="/img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png" class="c-t-profilimages"> 
                <span>
                    Sarah Eisenberg
                </span> 
            </div>

        </div> 
    `;

    let classID = `c-t-category`
    let categoryID = `c-t-category-html`;
    let c = id; 
    setColor(categoryID, classID, c);

}


/** to hide the clickedTask
 * 
 */
function hideClickedTask() {
    document.getElementById('open-clicked-task').style.display = "none";
}


/** to show the add task window on board site
 * 
 */
function displayAddTaskWindow() {

    document.getElementById('open-clicked-addtask').style.display = "flex";
    document.getElementById('c-t-addtask-window').style.display = "flex"
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
 * @param {array} element - beinhaltet den gefilterten Array mit forschleifen Zahl der jeweiligen Kategorie
 * 
 * @returns 
 */
function addTaskToKanbanHTML(element) {
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
            <div class="gray" style=" height: 6px; width:25%; border-radius:15px"> </div>
        </div>

        <span style="font-size: 13px; font-weight: 500; text-align: center"> 1/2 Done </span>
    </div>

    <div
        style="display:flex; justify-content: space-between; align-items:center; margin-top: 10px;">
        <div class="assigned-employees">
            <img src="../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png">
            <img src="../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png"
                class="second-picture">
            <img src="../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png"
                class="third-picture">
        </div>

        <img src="../img/arrow_low.svg">
    </div>
</div>
    `;
}