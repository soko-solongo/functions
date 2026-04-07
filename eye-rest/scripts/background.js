// service-worker.js
// runtime.sendMessage() is used to send a message from background.js to popup.js to reset the timer and start over again after the blur effect is removed. 
// runtime.onMessage() is used to listen for messages in popup.js and execute the function to reset the timer and start over again when the message is received.


// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.page-redder/service-worker.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage


function startTimer () {

    // Every 1 second will be deducted from the original value indicated in html file.
    let intervalId = setInterval(function() {

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

    if (message.action === "applyBlur") {
        // Targeting to all opened tabs.
            chrome.tabs.query({}, 
            function(tabs) {

                // First forEach loop is applying blur to every tab opened
                tabs.forEach(function(tab) {

                    //Applying the blur effect.
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

                    chrome.tabs.query({}, function(newTabs) {
                    //Second forEach loop is removing blur to every tab opened
                        newTabs.forEach(function(tab) {
                            chrome.scripting.executeScript({
                                target: {tabId: tab.id}, 
                                func: function() {
                                    let overlay = document.getElementById("blur-effect");
                                    if (overlay) {
                                        overlay.remove();
                                    }
                            }
                        });
                    }); // end of tabs.forEach

                    chrome.runtime.sendMessage({ action: "removeBlur"});
                    chrome.storage.local.set({timeRemaining: 10}); // Resetting the timer to 10 seconds after the blur effect is removed
                 }); // sending a message to popup.js to reset the timer and start over again

                }, 5000);

            });
    }
});