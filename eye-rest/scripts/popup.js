//RECAP of code: startTimer() is using setInterval() to countdown every second in the popup, and when it reaches 0, it stops and chrome.scripting does its magic of talking to browser and injecting blur effect to every opened tab through chrome.tabs.query({}) with 2 forEach Loops. (first forEach is applying blur, and second forEach is removing blur after 5 sec). Then, I am calling startTimer() again in the end to start over everything. However, I have to rethink about the "user-input" milestone of the assignment...


// setInterval() repeats the task every X milliseconds (1000 milliseconds = 1 second).
// parseInt() converts the string in the <p> to number.
// clearInterval() stops the timer when it reaches 0.
// chrome.tabs.query() gets all the tabs that are currently open in the browser.
// chrome.scripting.executeScript() executes the function that creates the overlay in all the tabs (injects the action to webpages).
// document.body.appendChild(overlay) adds the overlay to the webpage, which creates the blur effect.
// element.remove() removes the overlay from the webpage, which removes the blur effect.


//Learning resources:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval
// https://developer.chrome.com/docs/extensions/reference/api/scripting

chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "removeBlur") { // The blur effect will be removed in background.js after 5 seconds
        document.getElementById("timer").innerText = 10; //resetting the timer to 10 seconds
    }
})

setInterval(function() {
    chrome.storage.local.get("timeRemaining", function(result) {
        if (result.timeRemaining > 0) {
            document.getElementById("timer").innerText = result.timeRemaining; // Updating the timer in popup.html every second
        }
    });
}, 1000);

// looping the function
document.getElementById("startbutton").addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "startTimer"}); // Sending a message to background.js to start the timer when the user clicks the start button in popup.js
})