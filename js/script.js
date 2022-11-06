



async function init() {
    await includeHTML();
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
        logOut.style.animation = 'fadeIn 1s ease-in-out';
        logOut.classList.remove('d-none');
    } else {
        logOut.style.animation = 'fadeOut 1s ease-out';
        setTimeout(() => {
            logOut.classList.add('d-none');
        }, 900);
    }
}

