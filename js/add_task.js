let task = [];


setURL('smallest_backend_ever-master');

function blueBorder(id) {
    document.getElementById('prio-urgent').classList.remove('blue-border');
    document.getElementById('prio-medium').classList.remove('blue-border');
    document.getElementById('prio-low').classList.remove('blue-border');
    document.getElementById(id).classList.add('blue-border');

}


async function addTask() {
    let title = document.getElementById('title');
    let descripton = document.getElementById('descripton');
    let category = document.getElementById('category');
    let assingedTo = document.getElementById('assingedTo');
    let dueDate = document.getElementById('dueDate');

    let addTask = {
        "title": title.value,
        "descripton": descripton.value,
        "category": category.value,
        "assingedTo": assingedTo.value,
        "dueDate": dueDate.value,
    };

    task.push(addTask);
    console.log(task);
    
    saveOnServer();
    clearInput();
}


async function saveOnServer() {
    setURL("https://gruppe-313.developerakademie.net/Join/smallest_backend_ever-master");
    await backend.setItem('task', JSON.stringify(task));
}


function clearInput() {
    title.value = '';
    descripton.value = '';
    category.value = '';
    assingedTo.value = '';
    dueDate.value = '';
}
