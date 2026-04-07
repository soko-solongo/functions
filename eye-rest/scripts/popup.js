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



function startTimer () {

    // Every 1 second will be deducted from the original value indicated in html file.
    let intervalId = setInterval(function() {
        let timer = document.getElementById("timer"); // refers to <p> in html file
        let time = parseInt(timer.innerText); //converting the string in the <p> to an integer number
        time--; //substracting 1 from the time (counting down)
        timer.innerText = time; //updating the display after substracting 1    

        if (time === 0) {
            clearInterval(intervalId); //stopping the timer when it reaches 0
            chrome.runtime.sendMessage({action: "applyBlur"}); //sending a message to background.js to apple the blur
        }   
    }, 1000)
}

// looping the function
document.getElementById("startbutton").addEventListener("click", function() {
    startTimer();
})