chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "removeBlur") { // The blur effect will be removed in background.js after 5 seconds
    }
})

setInterval(function() {
    chrome.storage.local.get("timeRemaining", function(result) {
        if (result.timeRemaining >= 0) {
            document.getElementById("timer").innerText = result.timeRemaining; // Updating the timer in popup.html every second
        }
    });
}, 1000);

// looping the function
document.getElementById("startbutton").addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "startTimer"}); // Sending a message to background.js to start the timer when the user clicks the start button in popup.js
})