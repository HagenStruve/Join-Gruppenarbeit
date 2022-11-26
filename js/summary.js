let urgentTasks = [];



async function initSummary() {
    await includeHTML();
    updateStatus();
    await loadTasksFromServerSummary();
    updateSummary();
    sidebarBgPage();
    helloUser();
    showMostUrgentTaskDate();
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
    tasksOverview = await JSON.parse(backend.getItem('tasksOverview')) || [];
    downloadedTasks = await JSON.parse(backend.getItem('downloadedTasks')) || [];
    users = await JSON.parse(backend.getItem('users')) || [];
}


/**
 * get all urgentTask and pushs them into a own urgentTask array
 * then they will be sorted, the smallest date is last
 */
function getUrgentTasks() {
    for (let i = 0; i < downloadedTasks.length; i++) {
        const task = downloadedTasks[i];
        if (task.prio === 'Urgent') {
            urgentTasks.push(task);
        }
    }
    urgentTasks.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.dueDate) - new Date(a.dueDate);
    });
}


/**
 * date of the most urgent task will be showed
 */
function showMostUrgentTaskDate() {
    getUrgentTasks();
    if (urgentTasks.length > 0) {
        let lastIndex = urgentTasks.length - 1;
        document.getElementById('newDate').innerHTML = urgentTasks[lastIndex].dueDate;
    }
    else {
        document.getElementById('newDate').innerHTML = 'No urgent Tasks';
    }
}


/** updates summary data to show actual board overview
 * 
 */
function updateSummary() {
    if (tasksOverview.length > 0) {
        let overview = tasksOverview[0];
        document.getElementById('tasks-in-board').innerHTML = overview['tasksOnBoard'];
        document.getElementById('tasks-in-progress').innerHTML = overview['tasksInProgress'];
        document.getElementById('tasks-awaiting-feedback').innerHTML = overview['tasksInAwaitingFeedback'];
        document.getElementById('urgent-tasks').innerHTML = overview['urgentTasks'];
        document.getElementById('tasks-in-todo').innerHTML = overview['tasksInTodo'];
        document.getElementById('tasks-in-done').innerHTML = overview['tasksInDone'];
    }
}


/**
 * if you're registered and you login with email an password you will be greeted by your registered name
 */
function helloUser() {
    let userEmail = localStorage.getItem('userEmail');
    let userData = users.find(u => u.email == userEmail);
    if (userData) {
        let name = document.getElementById('name');
        name.innerHTML = userData.name;
    }
    else {
        document.getElementById('name').innerHTML = `Guest`;
    }
}