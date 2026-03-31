// setInterval() repeats the task every X milliseconds (1000 milliseconds = 1 second).
// parseInt() converts the string in the <p> to number.
// clearInterval() stops the timer when it reaches 0.

//Learning resources:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval

document.getElementById("startbutton").addEventListener("click", function() {
    let intervalId = setInterval(function() {
        let timer = document.getElementById("timer"); // refers to <p> in html file
        let time = parseInt(timer.innerText); //converting the string in the <p> to an integer number
        time--; //substracting 1 from the time (counting down)
        timer.innerText = time; //updating the display after substracting 1    

        if (time === 0) {
            clearInterval(intervalId); //stopping the timer when it reaches 0
            chrome.tabs.query({}, 
                function(tabs) {
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
                });
            });
        }
         
     }, 1000)
})