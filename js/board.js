

let tasks = [{
    'id': 0,
    'area': 'Media',
    'title': 'Redesign Website',
    'description': 'Modify contents of the website und und und nur ein Testtext',
    'subtasks': 2,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'urgent',
    'category': 'to-do'
},
{
    'id': 1,
    'area': 'Sales',
    'title': 'Call Clients',
    'description': 'Sells so much that we drown in money',
    'subtasks': 0,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'in-progress'
},
{
    'id': 2,
    'area': 'Backoffice',
    'title': 'Call Clients',
    'description': 'and teaches them good things',
    'subtasks': 0,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'awaiting-feedback'
},
{
    'id': 3,
    'area': 'Marketing',
    'title': 'Call Clients',
    'description': 'Market yourself so well that you dont need marketing anymore',
    'subtasks': 0,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'done'
}];

let downloadedTasks = [];
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


async function loadTasksFromServer() {
    setURL("https://gruppe-313.developerakademie.net/Join/smallest_backend_ever-master");
    await downloadFromServer();
    downloadedTasks = JSON.parse(backend.getItem('task')) || [];

    console.log('loaded 123 tasks')
}


async function renderBoardSite() {
    // await loadTasksFromServer();
    displayAllTasks();
}


/** Shows all Tasks on Website 
 * 
 * @param NumberOfCurrentTasks -// is needed to differ between the tasks and to assign the colors to the tasks
 */
function displayAllTasks() {
    NumberOfCurrentTasks = 0;
    displayToDos();
    displayInProgressTasks();
    displayAwaitingFeedbackTasks();
    displayDoneTasks();

    setColorTypeTasks();
}


function displayToDos() {
    // hier filtere ich den tasks JSON (in welchem alle Tasks stehen) in der Kategorie 'categorys'
    // somit sind alle JSON die in der category = "to-do" sind als Array definiert "todos"
    //siehe hier drunter
    let todos = tasks.filter(t => t['category'] == 'to-do');

    document.getElementById('to-do').innerHTML = '';

    for (let i = 0; i < todos.length; i++) {
        const element = todos[i];

        document.getElementById('to-do').innerHTML += addTaskToKanbanHTML(element);
        NumberOfCurrentTasks++;
    }
}


function displayInProgressTasks() {
    let inProgress = tasks.filter(t => t['category'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    for (let p = 0; p < inProgress.length; p++) {
        const element = inProgress[p];

        document.getElementById('in-progress').innerHTML += addTaskToKanbanHTML(element);
        NumberOfCurrentTasks++;

    }
}


function displayAwaitingFeedbackTasks() {
    let awaitingFeedback = tasks.filter(t => t['category'] == 'awaiting-feedback');
    document.getElementById('awaiting-feedback').innerHTML = '';

    for (let a = 0; a < awaitingFeedback.length; a++) {
        const element = awaitingFeedback[a];

        document.getElementById('awaiting-feedback').innerHTML += addTaskToKanbanHTML(element);
        NumberOfCurrentTasks++;
    }
}

function displayDoneTasks() {
    let done = tasks.filter(t => t['category'] == 'done');

    document.getElementById('done').innerHTML = '';
    for (let d = 0; d < done.length; d++) {
        const element = done[d];

        document.getElementById('done').innerHTML += addTaskToKanbanHTML(element);
        NumberOfCurrentTasks++;
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
 * @param tasktype - variable checks what the task-category is
 */
function setColorTypeTasks() {


    for (let c = 0; c < NumberOfCurrentTasks; c++) {

        let taskType = document.getElementById(`task-type${c}`).innerHTML;

        if (taskType === 'Design') {
            document.getElementById(`task-type${c}`).classList.add("orange");
        }
        if (taskType === 'Sales') {
            document.getElementById(`task-type${c}`).classList.add("pink");
        }
        if (taskType === 'Backoffice') {
            document.getElementById(`task-type${c}`).classList.add("cyan");
        }
        if (taskType === 'Marketing') {
            document.getElementById(`task-type${c}`).classList.add("blue");
        }
        if (taskType === 'Media') {
            document.getElementById(`task-type${c}`).classList.add("yellow");
        }

        else {
            stop;
        }
    }
}



// Function for filtering the search bar
function searchFunction() {
    let search = document.getElementById('input-search').value;
    search = search.toLowerCase();
    console.log(search);

    let posting = document.getElementById('postings');
    posting.innerHTML = '';

    if (search == "") {
        showPosts();
    }
    else {
        let found = posts.filter(e => e.username.toLowerCase().includes(search));
        console.log(found);

        for (let i = 0; i < found.length; i++) {

            let post = found[i]['username'];

            if (post.toLowerCase().includes(search)) {
                hTMLshowPosts(i, found);
            }
        }
        if (found.length == 0) {
            posting.innerHTML = `<div class="notfound"> Es wurde kein entsprechender Creator gefunden </div> `;
        }

    }
}



function addTaskToKanbanHTML(element) {
    return `
    <div class="kanban-task-container" draggable="true" ondragstart="startDragging(${element['id']})">
    <div>
        <span class="task-type" id="task-type${NumberOfCurrentTasks}">${element['area']}</span>
    </div>

    <div>
        <h3 class="kanban-task-title">
            Website redesign
        </h3>
    </div>

    <p class="task-description">
        Modify the contents of our Website and ...
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

        <img src="../img/orange-arrow-up.png">
    </div>
</div>
    `;
}