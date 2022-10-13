let task = [];
let prio = [];
let createdTasks = 0;
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
    let category = document.getElementById('category');
    let assingedTo = document.getElementById('assingedTo');
    let dueDate = document.getElementById('dueDate');
    let prioId = prio[0];

    let addTask = {
        "id": createdTasks,
        "title": title.value,
        "descripton": descripton.value,
        "category": category.value,
        "assingedTo": assingedTo.value,
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
    category.value = 'Select task Category';
    assingedTo.value = 'Select contacts to assign';
    dueDate.value = '';

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

function selectCategory(id) {
    id = id.replace('div-', '');
    let category = document.getElementById(id).innerHTML;
    document.getElementById("selected-category").innerHTML = category;
    document.getElementById("ul-category").classList.add('d-none');
    document.getElementById("select-div").classList.remove('no-border-bottom');
}
