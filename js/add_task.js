setURL('http://developerakademie.com/smallest_backend_ever');

function blueBorder(id) {
    document.getElementById('prio-urgent').classList.remove('blue-border');
    document.getElementById('prio-medium').classList.remove('blue-border');
    document.getElementById('prio-low').classList.remove('blue-border');
    document.getElementById(id).classList.add('blue-border');

}
