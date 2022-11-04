
async function initSummary() {
    await includeHTML();
    generateTime();
}


/**
 * generates an HTML text to greet the logged-in person depending on the time
 */
function generateTime() {
    let TimeHello = document.getElementById('hello');
    let currentStatus = "";

    const startTime = new Date();
    startTime.setHours(4);

    const middayTime = new Date();
    middayTime.setHours(11);
    middayTime.setMinutes(30);

    const endTime = new Date();
    endTime.setHours(17);
    endTime.setMinutes(30);

    function updateStatus() {
        const currentTime = new Date();
        let status;

        if (currentTime >= startTime && currentTime <= currentTime && middayTime) {
            status = "Good morning,";
        }
        else if (currentTime >= startTime && currentTime <= currentTime && endTime) {
            status = "Hello";
        } else if (currentTime <= middayTime && currentTime >= currentTime && middayTime) {
            status = "Good evening,";
        }

        if (status !== currentStatus) {
            currentStatus = status;
            TimeHello.innerText = currentStatus;
        }
    }

    updateStatus();
    setInterval(updateStatus, 1000 * 60);
}