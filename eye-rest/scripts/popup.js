// setInterval() repeats the task every X milliseconds (1000 milliseconds = 1 second).
// parseInt() converts the string in the <p> to number.
// clearInterval() stops the timer when it reaches 0.
// chrome.tabs.query() gets all the tabs that are currently open in the browser.
// chrome.scripting.executeScript() executes the function that creates the overlay in all the tabs.
// document.body.appendChild(overlay) adds the overlay to the webpage, which creates the blur effect.
// element.remove() removes the overlay from the webpage, which removes the blur effect.

//Learning resources:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval
// https://developer.chrome.com/docs/extensions/reference/api/scripting



// When user clicks "start" button, everything inside this function will run.
// document.getElementById("startbutton").addEventListener("click", function() {


function startTimer () {

    // Every 1 second will be deducted from the original value indicated in html file.
    let intervalId = setInterval(function() {
        let timer = document.getElementById("timer"); // refers to <p> in html file
        let time = parseInt(timer.innerText); //converting the string in the <p> to an integer number
        time--; //substracting 1 from the time (counting down)
        timer.innerText = time; //updating the display after substracting 1    

        if (time === 0) {
            clearInterval(intervalId); //stopping the timer when it reaches 0

            // Targeting to all opened tabs.
            chrome.tabs.query({}, 
            function(tabs) {
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

                    // Removing the blur effect after 5 seconds.
                    setTimeout(function() {
                        chrome.scripting.executeScript({
                            target: {tabId: tab.id}, 
                                func: function() {
                                    let overlay = document.getElementById("blur-effect");
                                    if (overlay) {
                                        overlay.remove();
                                    }
                                }
                        });
                    }, 5000);

                    });
            });
        }
         
    }, 1000)
}

document.getElementById("startbutton").addEventListener("click", function() {
    startTimer();
})