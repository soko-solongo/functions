let paras = document.querySelectorAll("p");
paras.forEach(paragraph => {
    paragraph.style.color = "red";
}
)

let container = `
<div id="paragraph-counter">
    You have ${paras.length} paragraphs in this page.
</div>
`
document.body.insertAdjacentHTML("afterbegin", container);