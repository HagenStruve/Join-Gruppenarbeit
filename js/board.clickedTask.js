
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



/** displays the associated importance on Clicked Task view
 */
 function displayImportanceStatusCT() {
    element = downloadedTasks[currentClickedTask];
    let importanceId = document.getElementById(`importance-id-c-t-${currentClickedTask}`);
    let white = "_white";
    displayImportanceStatus(element, importanceId, white);
    SetimportanceColorCT(element);
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




/** function gets the new value typed in the editMenu from clicked task  
 * 
 */
 function getNewValueFromEditedTask() {

    let newTitle = document.getElementById('c-t-title-edit').value;
    let newDescription = document.getElementById('c-t-description-edit').value;
    let newDate = document.getElementById('c-t-date-edit').value;

    downloadedTasks[currentClickedTask]['title'] = newTitle;
    downloadedTasks[currentClickedTask]['description'] = newDescription;
    checkIfDateEmpty(newDate); 
    downloadedTasks[currentClickedTask]['assingedTo'] = editedNames;
    editedNames = []; // clears array for new edit 
    let id = currentClickedTask;
    saveNewOnServer();
    displayClickedTask(id);
    displayAllTasks();
}




/** function sets new selected date or not, if no new date was selected
 * 
 * @param {string} newDate - contains new selected Date from edit menu 
 */
 function checkIfDateEmpty(newDate)  {
    if (!newDate == '') {
        downloadedTasks[currentClickedTask]['dueDate'] = newDate;
    }
}


/** removes clicked Task, callable in edit menu 
 * 
 */
function deleteTask() {
    downloadedTasks.splice(currentClickedTask, 1);
    saveNewOnServer(); 
    displayAllTasks(); 
    hideClickedTask(); 
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


/** function needed to get back from clicked Task
 * 
 */
 function hideClickedTask() {
    document.getElementById('open-clicked-task').style.display = "none";
    document.getElementById('c-t-window').style.display = "none";
}