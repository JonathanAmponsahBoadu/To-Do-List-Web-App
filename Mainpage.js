const dialog = document.querySelector(".DispDiag");
const openBtn = document.querySelector(".CreateTaskButton");
const closeBtn = document.querySelector(".Cancel");

const confirmBtn = document.querySelector(".Confirm");
// Dialog box
const taskField = document.querySelector(".taskField");
const taskTypeField = document.querySelector(".taskTypeField");
const dateField = document.querySelector(".dateField");
//elements field
// const taskSection = document.querySelector(".tasks_section");
const uList = document.querySelector(".unorderedList");


openBtn.addEventListener("click",()=>{
    const today = new Date().toISOString().split("T")[0];
    dateField.value = today;
    dialog.showModal();
});

closeBtn.addEventListener("click",()=>{
    dialog.close();
});

const createNewTask = (task,description,dateItem) =>{

    const taskList = document.createElement("li");
    taskList.classList.add("Tasks");

    const task_description = document.createElement("div");
    task_description.classList.add("task_decrp");

    const circleBtn = document.createElement("span");
    circleBtn.classList.add("circle")

    const taskTitle = document.createElement("p");
    taskTitle.classList.add("Title");
    taskTitle.textContent = task;
    
    const taskType = document.createElement("p");
    taskType.classList.add("Description");
    taskType.textContent = description;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "🗑️";

    const date = document.createElement("p");
    date.classList.add("details");
    date.textContent = dateItem;

    //checking and unchecking event
    circleBtn.addEventListener("click",()=>{
    circleBtn.classList.toggle("completed");
    taskList.classList.toggle("completed")
    saveTask();
    });

    //Deleting an event
    deleteBtn.addEventListener("click",(e)=>{
    taskList.remove();
    saveTask();
    });

    //Displaying the events
    task_description.appendChild(circleBtn);
    task_description.appendChild(taskTitle);
    task_description.appendChild(taskType);
    task_description.appendChild(deleteBtn);
    taskList.appendChild(task_description);
    taskList.appendChild(date);
    uList.appendChild(taskList);

};

confirmBtn.addEventListener("click",(event) =>{
    event.preventDefault();
    
    const newtask = taskField.value.trim();
    const newtaskDescp = taskTypeField.value.trim();
    const newDate = dateField.value

    if(newtask.trim()===""){
        alert("Task field must be filled");  
        return;
    };


    createNewTask(newtask,newtaskDescp,newDate);
    //elements creation
    // const taskSection = document.createElement("div");
    // taskSection.classList.add("tasks_section");

    // const uList = document.createElement("ul");



    taskField.value = "";
    taskTypeField.value = "";


    dialog.close();

    saveTask();

});




const saveTask =()=>{
    const tasks = [];
    const AlltaskItems = uList.querySelectorAll(".Tasks");
    AlltaskItems.forEach((taskItem) =>{
       const  taskName = taskItem.querySelector(".Title").textContent;
       const  taskDescription = taskItem.querySelector(".Description").textContent;
       const  taskDate = taskItem.querySelector(".details").textContent;
       const completed = taskItem.classList.contains("completed");

    tasks.push({task:taskName,description:taskDescription,date:taskDate,completed});
    })

    localStorage.setItem("tasks",JSON.stringify(tasks))
};

const loadTasks = () =>{
    const storedTasks = localStorage.getItem("tasks");
    if(!storedTasks){return;};
    const saved = JSON.parse(storedTasks);
    
        saved.forEach(({task,description,date,completed})=>{
            createNewTask(task,description,date);
            const taskItem = uList.lastElementChild;
            if(completed){
                taskItem.classList.add("completed");
                taskItem.querySelector(".circle").classList.add("completed");
            }
        });
    

}

window.addEventListener("DOMContentLoaded",loadTasks);

