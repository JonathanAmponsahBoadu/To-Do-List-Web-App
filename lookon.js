const dialog = document.querySelector(".DispDiag");
const openBtn = document.querySelector(".CreateTaskButton");
const closeBtn = document.querySelector(".Cancel");
const taskInput = document.querySelector(".form input[type='text']"); // Task input
const taskDescInput = document.querySelector(".form input[placeholder='Describe your task']"); // Description input
const dueDateInput = document.querySelector(".Date"); // Due date input
const taskList = document.querySelector(".tasks_section"); // Where tasks go
const addTaskBtn = document.querySelector(".Confirm"); // Confirm button

// Open Dialog Box
openBtn.addEventListener("click", () => {
    dialog.showModal();
});

// Close Dialog Box
closeBtn.addEventListener("click", () => {
    dialog.close();
});

// Add Task Dynamically
addTaskBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent page reload

    const taskTitle = taskInput.value.trim();
    const taskDescription = taskDescInput.value.trim();
    const dueDate = dueDateInput.value || "No due date";

    if (taskTitle === "") {
        alert("Task title cannot be empty!");
        return;
    }

    // Create task container
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("Tasks");

    // Create before pseudo-element (circle) using an inner span
    const circle = document.createElement("span");
    circle.classList.add("task-circle");

    // Create task description div
    const taskDecrpDiv = document.createElement("div");
    taskDecrpDiv.classList.add("task_decrp");

    // Create title paragraph
    const titlePara = document.createElement("p");
    titlePara.classList.add("Title");
    titlePara.textContent = taskTitle;

    // Create description paragraph
    const descPara = document.createElement("p");
    descPara.classList.add("Description");
    descPara.textContent = taskDescription || "No description";

    // Create due date
    const dueDatePara = document.createElement("p");
    dueDatePara.classList.add("details");
    dueDatePara.textContent = `Due: ${dueDate}`;

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-task");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
        taskDiv.remove();
    });

    // Mark task as completed on click
    taskDiv.addEventListener("click", () => {
        taskDecrpDiv.classList.toggle("completed");
    });

    // Append elements inside task container
    taskDecrpDiv.appendChild(titlePara);
    taskDecrpDiv.appendChild(descPara);
    taskDiv.appendChild(circle);
    taskDiv.appendChild(taskDecrpDiv);
    taskDiv.appendChild(dueDatePara);
    taskDiv.appendChild(deleteBtn);

    // Append to task list
    taskList.appendChild(taskDiv);

    // Clear input fields
    taskInput.value = "";
    taskDescInput.value = "";
    dueDateInput.value = new Date().toISOString().split("T")[0]; // Reset to today’s date

    // Close dialog box
    dialog.close();
});
