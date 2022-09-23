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

