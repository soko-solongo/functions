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
            chrome.tabs.query({active: true, currentWindow: true}, 
                function(tabs) {
                    chrome.scripting.executeScript({
                        target: {tabId: tabs[0].id}, 
                        func: function() {
                            console.log("Time to rest your eyes!")
                        }
                    });
            });
        }
         
     }, 1000)
})