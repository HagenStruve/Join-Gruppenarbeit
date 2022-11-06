
async function init() {
    await includeHTML();
    sidebarBgPage();
}


//function to display header and sidebar in any-* site
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


function showLogOut() {
    let logOut = document.getElementById('log-out');
    if (logOut.classList.contains('d-none')) {
        logOut.style.animation = 'fadeIn 0.8s ease-in-out';
        logOut.classList.remove('d-none');
    } else {
        logOut.style.animation = 'fadeOut 0.8s ease-out';
        setTimeout(() => {
            logOut.classList.add('d-none');
        }, 700);
    }
}


/**
 * sets the Background color of the selected page in the sidebar dark blue
 */
function sidebarBgPage() {
    if (location.pathname == "/html/summary.html") {
        document.getElementById('summary').style = 'background: #091931; !important';
    }

    else if (location.pathname == "/html/board.html") {
        document.getElementById('sidebar-board').style = 'background: #091931; !important';
    }

    else if (location.pathname == "/html/add_task.html") {
        document.getElementById('add-task').style = 'background: #091931; !important';
    }

    else if (location.pathname == "/html/contacts.html") {
        document.getElementById('contacts').style = 'background: #091931; !important';
    }

    else if (location.pathname == "/html/legal_notice.html") {
        document.getElementById('legal-notice').style = 'background: #091931; !important';
    }

    else if (location.pathname == "/html/privacy.html") {
        document.getElementById('privacy').style = 'background: #091931; !important';
    }
}
