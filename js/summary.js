
async function initSummary() {
    await includeHTML();
    updateStatus();
    await loadTasksFromServerSummary();
    updateSummary();
    sidebarBgPage();
    helloUser();
}


/**
 * generates an HTML text to greet the logged-in person depending on the time
 */
function updateStatus() {
    let TimeHello = document.getElementById('hello');
    let status = ``;
    const today = new Date();
    const currentTime = today.getHours();



    if (currentTime < 12) {
        status = "Good morning,";
    } else if (currentTime < 18) {
        status = "Good afternoon,";
    } else {
        status = "Good evening,";
    }

    currentStatus = status;
    TimeHello.innerText = currentStatus;

    setInterval(updateStatus, 1000 * 60);
}

/** gets an overview JSON of all tasks created, so function "updateSummary()"" can display them on summary
 * 
 * 
 */
async function loadTasksFromServerSummary() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await downloadFromServer();
    tasksOverview = JSON.parse(backend.getItem('tasksOverview')) || [];
    users = JSON.parse(backend.getItem('users')) || [];
}


/** updates summary data to show actual board overview
 * 
 */
function updateSummary() {
    let overview = tasksOverview[0];
    document.getElementById('tasks-in-board').innerHTML = overview['tasksOnBoard'];
    document.getElementById('tasks-in-progress').innerHTML = overview['tasksInProgress'];
    document.getElementById('tasks-awaiting-feedback').innerHTML = overview['tasksInAwaitingFeedback'];
    document.getElementById('urgent-tasks').innerHTML = overview['urgentTasks'];
    document.getElementById('tasks-in-todo').innerHTML = overview['tasksInTodo'];
    document.getElementById('tasks-in-done').innerHTML = overview['tasksInDone'];
}


function helloUser() {
    let userEmail = localStorage.getItem('userEmail');  
    let emailIndex = users.filter(u => u.email == userEmail);
    if (emailIndex) {
        document.getElementById('name').innerHTML = emailIndex[0].name;
    }
    else {
        document.getElementById('name').innerHTML = `Guest`;
    }
}