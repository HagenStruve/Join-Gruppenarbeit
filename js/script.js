let tasks = [{
    'id': 0,
    'area': 'media',
    'title': 'Redesign Website',
    'description': 'Modify contents of the website und und und nur ein Testtext',
    'subtasks': 2,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'urgent',
    'category': 'to-do'
},
{
    'id': 1,
    'area': 'Sales',
    'title': 'Call Clients',
    'description': 'Sells so much that we drown in money',
    'subtasks': 0,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'in-progress'
},
{
    'id': 2,
    'area': 'Backoffice',
    'title': 'Call Clients',
    'description': 'and teaches them good things',
    'subtasks': 0,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'awaiting-feedback'
},
{
    'id': 3,
    'area': 'Marketing',
    'title': 'Call Clients',
    'description': 'Market yourself so well that you dont need marketing anymore',
    'subtasks': 0,
    'assigned': '../img/christina-wocintechchat-com-0Zx1bDv5BNY-unsplash 1.png',
    'importance': 'medium',
    'category': 'done'
}];


async function init() {
    await includeHTML();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');

    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html"); // includes/header.html
        let response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();
        }

        else {
            element.innerHTML = "Page not found.";
        }
    }
}

function showAddTask() {
    document.getElementById('render').innerHTML = '<div w3-include-html="add_task.html"></div>';
    includeHTML();
}


function showBoard() {
    document.getElementById('render').innerHTML = '<div w3-include-html="board.html"></div>';
    includeHTML();
}

function showSummary() {
    document.getElementById('render').innerHTML = '<div w3-include-html="summary.html"></div>';
    includeHTML();
}

function showContacts() {
    document.getElementById('render').innerHTML = '<div w3-include-html="contacts.html"></div>';
    includeHTML();
}

function showLegalNotice() {
    document.getElementById('render').innerHTML = '<div w3-include-html="legal_notice.html"></div>';
    includeHTML();
}

function showHelp() {
    document.getElementById('render').innerHTML = '<div w3-include-html="help.html"></div>';
    includeHTML();
}
