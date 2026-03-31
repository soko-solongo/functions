document.getElementById("startbutton").addEventListener("click", function() {
    setInterval(function() {
        let timer = document.getElementById("timer");
        let time = timer.innerText.split(":");
    console.log("started")
    }, 1000)
})