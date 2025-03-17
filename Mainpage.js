const dialog = document.querySelector(".DispDiag");
const openBtn = document.querySelector(".CreateTaskButton");
const closeBtn = document.querySelector(".Btn.Cancel");

openBtn.addEventListener("click",()=>{
    dialog.showModal();
});

closeBtn.addEventListener("Click",()=>{
    dialog.closest();
})