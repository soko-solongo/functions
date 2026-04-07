// console.log("background worker is running");

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

                    document.getElementById("timer").innerText = 10; //resetting the timer to 10 seconds after it reaches 0
                    startTimer(); // restarting the timer
                    });


                }, 5000);
            });
    }
});