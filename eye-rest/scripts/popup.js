// Code structure is explained in background.js file

let selectedTime = 60; // default time is 1 min

document.querySelector(".timebutton").classList.add("selected"); // Adding a visual indication of the default selected time button
document.querySelectorAll(".timebutton").forEach(button => {
    button.addEventListener("click", function() {
        selectedTime = parseInt(this.getAttribute("data-time")); // Updating selectedTime based on the button clicked by the user
        document.querySelectorAll(".timebutton").forEach(function(btn) {
            btn.classList.remove("selected");
        });
        button.classList.add("selected"); // Adding a visual indication of the selected time button
        });
    });

setInterval(function() {
    chrome.storage.local.get("timeRemaining", function(result) {
        if (result.timeRemaining >= 0) {
            document.getElementById("timer").innerText = result.timeRemaining; // Updating the timer in popup.html every second
        }
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