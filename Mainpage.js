const dialog = document.querySelector(".DispDiag");
const openBtn = document.querySelector(".CreateTaskButton");
const closeBtn = document.querySelector(".Cancel");
const dateField = document.querySelector(".Date");

openBtn.addEventListener("click",()=>{
    const today = new Date().toISOString().split("T")[0];
    dateField.value = today;
    dialog.showModal();
});

closeBtn.addEventListener("click",()=>{
    dialog.close();
});


