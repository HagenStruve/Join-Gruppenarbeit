let contact = [];

function newConatct() {
    document.getElementById('edit-contact').classList.remove('d-none');
    document.getElementById('edit-contact').classList.add('edit-contact');
}


function cancel() {
    document.getElementById('edit-contact').classList.remove('edit-contact');
    document.getElementById('edit-contact').classList.add('d-none');
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}

function addContact() {
    document.getElementById('name').value;
    document.getElementById('email').value;
    document.getElementById('phone').value;
}