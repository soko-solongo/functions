// RECAP OF CODE STRUCTURE: So basically, background.js is doing the entire job of core function, and popup.js is only showing what's happening and listen for user clicks.

// 1. background.js owns the timer and screen blocker. It controls when to show the blocker, injects the sheep img into all opened tabs, and decides when to remove it, and restart.
//    startTimer() counts down every 1 second using storage, and then calls applyBlocker() when time reaches 0.
//    applyBlocker() applies the blocker effect to all tabs using chrome.scripting (by injecting the code), and then removes the blocker effect after 5 seconds using setTimeout().

// 2. popup.js listens for messages from background.js to reset the timer and start over again after the blocker effect is removed.
//    popup.js reads the time remaining from storage and updates the timer in popup.html every second using setInterval(). 
//    when start is clicked, popup.js sends a message to background.js to start the timer.

// 3. chrome.storage is used to store the time remaining for the timer, which allows both background.js and popup.js to access and update the timer value.
//    it's basically a shared memory for both background.js and popup.js to communicate and keep track of the timer value.


// FULL USER FLOW:
// 1. User clicks "Start" button
// 2. popup.js sends a message to background.js to start the timer.
// 3. background.js listens for the message and starts the countdown.
// 4. popup.js reads the storage in every 1 second and displays the value in popup window shown to the user.
// 5. when timer value hits 5, the small sheep will appear and start growing, which is a warning for the user that the blocker will be applied in 5 seconds.
// 6. when timer value hits 0, applyBlocker() function activates (sheep stay/blocks there for 10 seconds)
// 7. after 15 seconds, the blocker effects is removed and startTimer() runs again
// 8. cancel at any point - background.js clears everything and stops the loop.



// SOME FUNCTIONS I learned on the way to achieve my code:
// setInterval() repeats the task every X milliseconds (1000 milliseconds = 1 second).
// parseInt() converts the string in the <p> to number.
// clearInterval() stops the timer when it reaches 0.
// chrome.tabs.query() gets all the tabs that are currently open in the browser.
// chrome.scripting.executeScript() executes the function that creates the overlay in all the tabs (injects the action to webpages).
// document.body.appendChild(overlay) adds the overlay to the webpage, which creates the blocker effect.
// element.remove() removes the overlay from the webpage, which removes the blocker effect.
// service-worker.js runs in the background and listens for updates/messages from popup.js to perform the actions.
// runtime.sendMessage() is used to send a message from background.js to popup.js to reset the timer and start over again after the blocker effect is removed. 
// runtime.onMessage() is used to listen for messages in popup.js and execute the function to reset the timer and start over again when the message is received.
// requestAnimationFrame() is used to create a smooth animation effect when the sheep image grows, which makes it look like the sheep is getting bigger gradually.

//Learning resources for SOME FUNCTIONS:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval
// https://developer.chrome.com/docs/extensions/reference/api/scripting
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.page-redder/service-worker.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame



// function formatTime(totalSeconds) {
//     const mm = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
//     const ss = (totalSeconds % 60).toString().padStart(2, '0');
//     return `${mm}:${ss}`;
// }

// console.log(formatTime(125)); // "02:05"



// STORING IDs to call out later in case the user clicks "cancel" button in the middle of functios running.
let intervalId = null; // Declaring intervalId to be empty 
    // let intervalID = null; --- It means the value slot exists, but it is empty.
    // intervalId = setInterval(..bla bla...) --- It means the value slot is now filled with timer value.
    // clearInterval(intervalId) ---  It means the value slot is empty back again.
let blockerTimeoutId = null; // Clearing the blocker in case the user clicks cancel


// STARTING THE COUNTDOWN TIMER
function startTimer () {

    // Clearing any existing timer before starting a new one
    if (intervalId) {
        clearInterval(intervalId);
    }

    // Every 1 second will be deducted from the original value indicated in html file.
    intervalId = setInterval(function() {

        chrome.storage.local.get("timeRemaining", function(result) {
            let time = result.timeRemaining - 1; // Subtracting 1 from the time remaining
            chrome.storage.local.set({timeRemaining: time});

            // Showing warning 5 seconds before the blocker activates
            if (time === 5) {
                applyBlocker(); // Calling the function to apply blocker effect
            }

            if (time === 0) {
                clearInterval(intervalId); // Stopping the timer when it reaches 0
            }
        });  
    }, 1000) // 1000ms = 1 second
}

// APPLYING THE BLOCKER EFFECT aka injecting the sheep
function applyBlocker() {
    const sheepUrl = chrome.runtime.getURL("assets/sheep_item.svg"); // Getting the URL of the sheep image in the extension's directory to use it as blocker
    chrome.tabs.query({}, function(tabs) {

        //Applying blocker to all tabs
        tabs.forEach(function(tab) {

            chrome.scripting.executeScript({
                target: {tabId: tab.id}, 
                args: [sheepUrl],
                func: function(sheepUrl) {

                    if (document.getElementById("blocker-effect")) return; 

                    let overlay = document.createElement("img");

                        // I tried placing the styling code in CSS file, it doesn't work because JS can't access the items that doesn't exist in the DOM yet, so I had to put the styling code here after creating the element in order to make it work.
                        overlay.src = sheepUrl;
                        overlay.id = "blocker-effect";
                        overlay.style.position = "fixed";
                        overlay.style.top = "50%";
                        overlay.style.left = "50%";
                        overlay.style.transform = "translate(-50%, -50%)";
                        overlay.style.width = "10vw";
                        overlay.style.height = "auto";
                        overlay.style.aspectRatio = "1/1";
                        overlay.style.zIndex = "9999";
                        overlay.style.transition = "width 5s linear";

                    // overlay.id = "blocker-effect";
                    // overlay.style.position = "fixed";
                    // overlay.style.top = "0";
                    // overlay.style.left = "0";
                    // overlay.style.width = "100%"; 
                    // overlay.style.height = "100%";
                    // overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    // overlay.style.backdropFilter = "blur(5px)";
                    // overlay.style.zIndex = "9999";


                    document.body.appendChild(overlay);

                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            overlay.style.width = "150vw"; // Animating the width of the sheep image from 10vw to 150vw to create a growing effect.
                        }); 
                    });

                }
            });
        }); // end of tabs.forEach

        // Removing the blocker effect after X seconds.
        blockerTimeoutId = setTimeout(function() {
            removeBlocker();
            chrome.storage.local.get("originalTime", function(result) { // calling the function to remove the blocker effect
                chrome.storage.local.set({
                    timeRemaining: result.originalTime,
                    isRunning: true
                });
            startTimer(); // starting the timer again after the blocker effect is removed, which creates a loop of the entire process
            });

        }, 15000); // for demo, it's growing for 5 sec, and staying still for 10 sec.
    });
}

// OPPOSITE OF applyBlocker(). It injects code into every opened tab and finds id = "blocker-effect" and removes it.
function removeBlocker() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.scripting.executeScript({
                target: {tabId: tab.id}, 
                func: function() {
                    let overlay = document.getElementById("blocker-effect");
                    if (overlay) {
                        overlay.remove();
                    }
                }
            });
        });
    });
    
}
// SHARED MEMORY OF background.js and popup.js to keeo track of timer value.

// addListener means "whenever message arrives, do the following thing."
chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === "startTimer") {
        chrome.storage.local.set({
            timeRemaining: message.time, // Countdown value taken directly from the msg popup sent.
            originalTime: message.time, // Storing the original time that user chose to begin with, so that it resets back to it.
            isRunning: true // control to enable/disable start or cancel button.
        }); 
        // Setting the timer to 10 seconds
        startTimer(); // Starting the timer
    }

    if (message.action === "cancelTimer") { // The timer will be cancelled in background.js when the user clicks the cancel button in popup.js
        if (blockerTimeoutId) {
            clearTimeout(blockerTimeoutId); // Clearing the blocker timeout to prevent the blocker from being applied after the timer is cancelled
            blockerTimeoutId = null; // Resetting blockerTimeoutId to null after clearing the timeout
        }

        clearInterval(intervalId); // Clearing everything by grabbing the null id I set earlier.
        intervalId = null; // Resetting intervalId to null after clearing the timer
        removeBlocker(); // Calling the function to remove the blocker effect when the timer is cancelled
        chrome.storage.local.set({ isRunning: false }); // Setting isRunning to false in storage to indicate that the timer is not running anymore after the timer is cancelled
        chrome.storage.local.get("originalTime", function(result) { // Getting the original time from storage to reset the timer in popup.js when the timer is cancelled
            chrome.storage.local.set({
                timeRemaining: result.originalTime // Resetting the timer to the original time after the timer is cancelled
            }); 
        });
    }
});