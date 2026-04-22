// Code structure is explained in background.js file

// disabled attribute is used to disable "start" and "cancel" button.
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled

// specifying multiple conditions in if else rule
// https://stackoverflow.com/questions/8710442/how-to-specify-multiple-conditions-in-an-if-statement-in-javascript


// for demo purposes, the default time is set to 30 seconds. In a real implementation, this could be set to a longer duration like 30 minutes (1800 seconds).


// formatting the time to be MM:SS through creating a new function
function formatTime(totalSeconds) {
    const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const ss = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
}

let selectedTime = 30;
document.getElementById("timer").innerText = formatTime(selectedTime);

document.querySelector(".timebutton[data-time='30']").classList.add("selected"); // Adding a visual indication of the default selected time button
document.querySelectorAll(".timebutton").forEach(button => {
    button.addEventListener("click", function() {
        selectedTime = parseInt(this.getAttribute("data-time")); // Updating selectedTime based on the button clicked by the user
        document.querySelectorAll(".timebutton").forEach(function(btn) {
            btn.classList.remove("selected");
        });
        button.classList.add("selected"); // Adding a visual indication of the selected time button

        document.getElementById("timer").innerText = formatTime(selectedTime);
        });
    });

function updateButtonState(isRunning) {
    document.getElementById("startbutton").disabled = isRunning; // Disabling the start button when the timer is running
    document.getElementById("cancelbutton").disabled = !isRunning; // Enabling the cancel button when the timer is running
}

setInterval(function() {
    chrome.storage.local.get(["timeRemaining", "isRunning"], function(result) {
        if (result.isRunning && result.timeRemaining >= 0) {
            document.getElementById("timer").innerText = formatTime(result.timeRemaining); // Updating the timer in popup.html every second

        } else if (!result.isRunning) {
            document.getElementById("timer").innerText = formatTime(selectedTime); // Resetting displayed timer to --
        }

        updateButtonState(result.isRunning);
    });

}, 1000);

// start button
document.getElementById("startbutton").addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "startTimer", time: selectedTime}); // Sending a message to background.js to start the timer when the user clicks the start button in popup.js
})

// cancel button
document.getElementById("cancelbutton").addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "cancelTimer"}); // Sending a message to background.js to cancel the entire thing when the user clicks the cancel button in popup.js
})