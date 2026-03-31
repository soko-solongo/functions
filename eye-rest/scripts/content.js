let paras = document.querySelectorAll("p");
paras.forEach(paragraph => {
    // paragraph.style.filter = "blur(5px)";
    paragraph.style.color = "blue";
}
)

let container = `
    <div id="blur-effect">
    </div>
    `
document.body.insertAdjacentHTML("afterbegin", container);