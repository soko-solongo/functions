// RECAP OF CODE STRUCTURE: So basically, background.js is doing the entire job of core function, and popup.js is only showing what's happening and listen for user clicks.

// 1. background.js owns the timer and the blur effect.
//    startTimer() counts down every 1 second using storage, and then calls applyBlur() when time reaches 0.
//    applyBlur() applies the blur effect to all tabs using chrome.scripting (by injecting the code), and then removes the blur effect after 5 seconds using setTimeout().

// 2. popup.js listens for messages from background.js to reset the timer and start over again after the blur effect is removed.
//    popup.js reads the time remaining from storage and updates the timer in popup.html every second using setInterval(). 
//    when start is clicked, popup.js sends a message to background.js to start the timer.

// 3. chrome.storage is used to store the time remaining for the timer, which allows both background.js and popup.js to access and update the timer value.
//    it's basically a shared memory for both background.js and popup.js to communicate and keep track of the timer value.


// FULL USER FLOW:
// 1. User clicks "Start" button
// 2. popup.js sends a message to background.js to start the timer.
// 3. background.js listens for the message and starts the countdown in storage.
// 4. popup.js reads the storage and displays the value in popup window shown to the user.
// 5. when timer value hits 0, applyBlur() function activates
// 6. All opened tabs get blurred for 5 seconds
// 7. After 5 seconds, the blur effect is removed and a message is sent to popup.js to reset the timer and startTimer() activates again.
// 8. (loops forever) popup.js listens for the message and resets the timer to 10 seconds, which starts the countdown again in popup window shown to the user.


// SOME FUNCTIONS I learned on the way to achieve my code:
// setInterval() repeats the task every X milliseconds (1000 milliseconds = 1 second).
// parseInt() converts the string in the <p> to number.
// clearInterval() stops the timer when it reaches 0.
// chrome.tabs.query() gets all the tabs that are currently open in the browser.
// chrome.scripting.executeScript() executes the function that creates the overlay in all the tabs (injects the action to webpages).
// document.body.appendChild(overlay) adds the overlay to the webpage, which creates the blur effect.
// element.remove() removes the overlay from the webpage, which removes the blur effect.
// service-worker.js
// runtime.sendMessage() is used to send a message from background.js to popup.js to reset the timer and start over again after the blur effect is removed. 
// runtime.onMessage() is used to listen for messages in popup.js and execute the function to reset the timer and start over again when the message is received.


//Learning resources for SOME FUNCTIONS:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval
// https://developer.chrome.com/docs/extensions/reference/api/scripting
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.page-redder/service-worker.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage

function removeBlur() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.scripting.executeScript({
                target: {tabId: tab.id}, 
                func: function() {
                    let overlay = document.getElementById("blur-effect");
                    if (overlay) {
                        overlay.remove();
                    }
                }
            });
        });
    });
    
    if (message.action === "cancelTimer") { // The timer will be cancelled in background.js when the user clicks the cancel button in popup.js
        clearInterval(intervalId);
        intervalId = null; // Resetting intervalId to null after clearing the timer
        removeBlur(); // Calling the function to remove the blur effect when the timer is cancelled
        chrome.storage.local.set({timeRemaining: 10}); // Resetting the timer to 10 seconds when the timer is cancelled
    }
}


function applyBlur() {
    chrome.tabs.query({}, function(tabs) {

        //Applying blur to all tabs
        tabs.forEach(function(tab) {

            chrome.scripting.executeScript({
                target: {tabId: tab.id}, 
                func: function() {
                    let overlay = document.createElement("div");
                    overlay.id = "blur-effect";
                    overlay.style.position = "fixed";
                    overlay.style.top = 0;
                    overlay.style.left = 0;
                    overlay.style.width = "100%";
                    overlay.style.height = "100%";
                    overlay.style.backdropFilter = "blur(5px)";
                    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    overlay.style.zIndex = 9999;
                    document.body.appendChild(overlay);
                }
            });
        }); // end of tabs.forEach

        // Removing the blur effect after 5 seconds.
        setTimeout(function() {

            removeBlur(); // Calling the function to remove the blur effect after 5 seconds
            chrome.runtime.sendMessage({action: "removeBlur"}); // Sending a message to popup.js to reset the timer and start over again after the blur effect is removed.

        }, 5000);

    });
}

let intervalId = null; // Declaring intervalId to be empty 
// let intervalID = null; --- It means the value slot exists, but it is empty.
// intervalId = setInterval(..bla bla...) --- It means the value slot is now filled with timer value.
// clearInterval(intervalId) ---  It means the value slot is empty back again.

function startTimer () {

    if (intervalId) {
        clearInterval(intervalId); // Clearing any existing timer before starting a new one
    }

    // Every 1 second will be deducted from the original value indicated in html file.
    intervalId = setInterval(function() {

        chrome.storage.local.get("timeRemaining", function(result) {
            let time = result.timeRemaining - 1; // Subtracting 1 from the time remaining
            chrome.storage.local.set({timeRemaining: time});

            if (time === 0) {
                clearInterval(intervalId); // Stopping the timer when it reaches 0
                applyBlur(); // Calling the function to apply blur effect when the timer reaches 0
            }
        });  
    }, 1000)
}

chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "startTimer") { // The timer will be started in background.js when the user clicks the start button in popup.js
        chrome.storage.local.set({timeRemaining: 10}); // Setting the timer to 10 seconds
        startTimer(); // Starting the timer
    }
});