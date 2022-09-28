
let currentDraggedElement; 
// filters tasks and displays them assigned // Funktion wird noch kleiner gemacht 
function updateHTML() {

    let todos = tasks.filter(t => t['category'] == 'to-do'); 
    document.getElementById('to-do').innerHTML = ''; 

    for (let i = 0; i < todos.length; i++) {
        const element = todos[i];

        document.getElementById('to-do').innerHTML += addTaskToKanbanHTML(element); 
    }

    let inProgress = tasks.filter(t => t['category'] == 'in-progress'); 
    document.getElementById('in-progress').innerHTML = ''; 

    for (let p = 0; p < inProgress.length; p++) {
        const element = inProgress[p];

        document.getElementById('in-progress').innerHTML += addTaskToKanbanHTML(element); 
        
    }

    let awaitingFeedback = tasks.filter(t => t['category'] == 'awaiting-feedback'); 
    document.getElementById('awaiting-feedback').innerHTML = '';
    
    for (let a = 0; a < awaitingFeedback.length; a++) {
        const element = awaitingFeedback[a];
        
        document.getElementById('awaiting-feedback').innerHTML += addTaskToKanbanHTML(element); 
    }

    let done = tasks.filter(t => t['category'] == 'done'); 

    document.getElementById('done').innerHTML = ''; 

    for (let d = 0; d < done.length; d++) {
        const element = done[d];
        
        document.getElementById('done').innerHTML += addTaskToKanbanHTML(element); 
    }
}


function allowDrop(ev) { // from W3School predefined // 
    ev.preventDefault();
}


// change the category to dropped task
function moveTo(category) {
    tasks[currentDraggedElement]['category'] = category; 
    updateHTML(); 
} 


// specify current dragged element
function startDragging(id) {
    currentDraggedElement = id;
}


function addTaskToKanbanHTML(element) {
    return `
    <div class="kanban-task-container" draggable="true" ondragstart="startDragging(${element['id']})">
    <div>
        <span class="task-type"> ${element['area']} </span>
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


