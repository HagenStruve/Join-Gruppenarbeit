

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
