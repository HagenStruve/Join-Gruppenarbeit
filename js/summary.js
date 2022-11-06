
async function initSummary() {
    await includeHTML();
    updateStatus();
    sidebarBgPage();
}


/**
 * generates an HTML text to greet the logged-in person depending on the time
 */
function updateStatus() {
    let TimeHello = document.getElementById('hello');
    let status = ``;
    const today = new Date();
    const currentTime = today.getHours();



    if (currentTime < 12) {
        status = "Good morning,";
    } else if (currentTime < 18) {
        status = "Good afternoon,";
    } else {
        status = "Good evening,";
    }

    currentStatus = status;
    TimeHello.innerText = currentStatus;

    setInterval(updateStatus, 1000 * 60);
}
