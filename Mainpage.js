const dialog = document.querySelector(".DispDiag");
const openBtn = document.querySelector(".CreateTaskButton");
const closeBtn = document.querySelector(".Cancel");
const confirmBtn = document.querySelector(".Confirm");
const taskField = document.querySelector(".taskField");
const taskTypeField = document.querySelector(".taskTypeField");
const dateField = document.querySelector(".dateField");
const uList = document.querySelector(".unorderedList");

openBtn.addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];
  dateField.value = today;
  dialog.showModal();
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

const loadTasks = async () => {
  try {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    uList.innerHTML = "";
    tasks.forEach(({ id, task, description, date, completed }) => {
      createNewTask(task, description, date, id, completed);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

const saveTask = async (taskData) => {
  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (response.ok) loadTasks();
  } catch (error) {
    console.error("Error saving task:", error);
  }
};

const createNewTask = (task, description, date, id, completed = false) => {
  const taskList = document.createElement("li");
  taskList.classList.add("Tasks");
  if (completed) taskList.classList.add("completed");

  const task_description = document.createElement("div");
  task_description.classList.add("task_decrp");

  const circleBtn = document.createElement("span");
  circleBtn.classList.add("circle");
  if (completed) circleBtn.classList.add("completed");

  const taskTitle = document.createElement("p");
  taskTitle.classList.add("Title");
  taskTitle.textContent = task;

  const taskType = document.createElement("p");
  taskType.classList.add("Description");
  taskType.textContent = description;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "🗑️";

  const dateItem = document.createElement("p");
  dateItem.classList.add("details");
  dateItem.textContent = date;

  circleBtn.addEventListener("click", async () => {
    taskList.classList.toggle("completed");
    circleBtn.classList.toggle("completed");

    try {
      await fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: taskList.classList.contains("completed"),
        }),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  });

  deleteBtn.addEventListener("click", async () => {
    try {
      await fetch(`/tasks/${id}`, { method: "DELETE" });
      taskList.remove();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  });

  task_description.appendChild(circleBtn);
  task_description.appendChild(taskTitle);
  task_description.appendChild(taskType);
  task_description.appendChild(deleteBtn);
  taskList.appendChild(task_description);
  taskList.appendChild(dateItem);
  uList.appendChild(taskList);
};

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const newtask = taskField.value.trim();
  const newtaskDescp = taskTypeField.value.trim();
  const newDate = dateField.value;

  if (newtask === "") {
    alert("Task field must be filled");
    return;
  }

  saveTask({
    task: newtask,
    description: newtaskDescp,
    date: newDate,
    completed: false,
  });

  taskField.value = "";
  taskTypeField.value = "";
  dialog.close();
});

window.addEventListener("DOMContentLoaded", loadTasks);
