let task = [];
let prio = [];
let createdTasks = 0;
let liCategory;
let liContact;
function markedPrio(id) {
    prio = [];
    changeBg(id);

    let prioId = document.getElementById(id);
    prio.push(prioId)
}


async function initAddTask() {
    await includeHTML();
    generateDate();
}

function changeBg(id) {
    let urgent = document.getElementById('prio-urgent');
    let medium = document.getElementById('prio-medium');
    let low = document.getElementById('prio-low');
    if (id == 'prio-urgent') {
        document.getElementById('urgent-img').src = "../img/arrow_urgent_white.svg";
        document.getElementById('medium-img').src = "../img/medium.svg";
        document.getElementById('low-img').src = "../img/arrow_low.svg";
        urgent.classList.add('bg-orange');
        medium.classList.remove('bg-yellow');
        low.classList.remove('bg-green');
    }

    if (id == 'prio-medium') {
        document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
        document.getElementById('medium-img').src = "../img/medium_white.svg";
        document.getElementById('low-img').src = "../img/arrow_low.svg";
        urgent.classList.remove('bg-orange');
        medium.classList.add('bg-yellow');
        low.classList.remove('bg-green');
    }

    if (id == 'prio-low') {
        document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
        document.getElementById('medium-img').src = "../img/medium.svg";
        document.getElementById('low-img').src = "../img/arrow_low_white.svg";
        urgent.classList.remove('bg-orange');
        medium.classList.remove('bg-yellow');
        low.classList.add('bg-green');
    }
}


async function addTask() {
    let title = document.getElementById('title');
    let descripton = document.getElementById('descripton');
    let category = liCategory;
    let assingedTo = document.getElementById(liContact).innerHTML;
    let dueDate = document.getElementById('dueDate');
    let prioId = prio[0];
    console.log(liCategory);

    let addTask = {
        "id": createdTasks,
        "title": title.value,
        "descripton": descripton.value,
        "category": category,
        "assingedTo": assingedTo,
        "dueDate": dueDate.value,
        "prio": prioId,
    };

    task.push(addTask);
    console.log(task);

    saveOnServer();
    clearInput();
    createdTasks++;
}


async function saveOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join-Gruppenarbeit/smallest_backend_ever-master");
    await backend.setItem('task', JSON.stringify(task));
}


function clearInput() {
    document.getElementById('urgent-img').src = "../img/arrow_urgent.svg";
    document.getElementById('medium-img').src = "../img/medium.svg";
    document.getElementById('low-img').src = "../img/arrow_low.svg";
    document.getElementById('prio-urgent').classList.remove('bg-orange');
    document.getElementById('prio-medium').classList.remove('bg-yellow');
    document.getElementById('prio-low').classList.remove('bg-green');

    title.value = '';
    descripton.value = '';
    document.getElementById('selected-category').innerHTML = 'Select task Category';
    document.getElementById('selected-contact').innerHTML = 'Select contacts to assign';
    generateDate();

    prio = [];
}


function generateDate() {
    document.getElementById("dueDate").valueAsDate = new Date();
}


function showCategories() {
    if (document.getElementById("ul-category").classList.contains('d-none')) {
        document.getElementById("ul-category").classList.remove('d-none');
        document.getElementById("select-div").classList.add('no-border-bottom');
    }
    else {
        document.getElementById("ul-category").classList.add('d-none');
        document.getElementById("select-div").classList.remove('no-border-bottom');
    }
}


function showContacts() {
    if (document.getElementById("ul-contact").classList.contains('d-none')) {
        document.getElementById("ul-contact").classList.remove('d-none');
        document.getElementById("select-div-contact").classList.add('no-border-bottom');
    }
    else {
        document.getElementById("ul-contact").classList.add('d-none');
        document.getElementById("select-div-contact").classList.remove('no-border-bottom');
    }
}


function selectCategory(id) {
    liCategory = id.replace('div-', '');
    let category = document.getElementById(id).innerHTML;
    document.getElementById('selected-category').style = 'display: flex; align-items: center; list-style-type: none;';
    document.getElementById("selected-category").innerHTML = category;
    document.getElementById(liCategory).style = 'margin:0; margin-right: 20px';
    document.getElementById("ul-category").classList.add('d-none');
    document.getElementById("select-div").classList.remove('no-border-bottom');
}


function selectContact(id) {
    liContact = id.replace('div-', '');
    let contact = document.getElementById(id).innerHTML;
    document.getElementById('selected-contact').style = 'display: flex; align-items: center; list-style-type: none;';
    document.getElementById("selected-contact").innerHTML = contact;
    document.getElementById(liContact).style = 'margin:0; margin-right: 20px';
    document.getElementById("ul-contact").classList.add('d-none');
    document.getElementById("select-div-contact").classList.remove('no-border-bottom');
}
