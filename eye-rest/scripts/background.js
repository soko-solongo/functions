// service-worker.js
// runtime.sendMessage() is used to send a message from background.js to popup.js to reset the timer and start over again after the blur effect is removed. 
// runtime.onMessage() is used to listen for messages in popup.js and execute the function to reset the timer and start over again when the message is received.


// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.page-redder/service-worker.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage


chrome.runtime.onMessage.addListener(function(message) {
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
                 }); // sending a message to popup.js to reset the timer and start over again

                }, 5000);

            });
    }
});