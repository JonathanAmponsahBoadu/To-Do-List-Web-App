const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tasks.json");

app.use(express.static(__dirname));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Mainpage.html"));
});

app.get("/Mainpage(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "Mainpage.html"));
});

app.get("/tasks", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading tasks file" });
    try {
      const tasks = data ? JSON.parse(data) : [];
      res.json(tasks);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).send("Error parsing tasks file.");
    }
  });
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading tasks file" });

    let tasks;
    try {
      tasks = data ? JSON.parse(data) : [];
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      tasks = [];
    }
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push(newTask);

    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error writing tasks file" });
      res.json(newTask);
    });
  });
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading tasks file" });
    let tasks = JSON.parse(data);
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1)
      return res.status(404).json({ error: "Task not found" });

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error writing tasks file" });
      res.json(tasks[taskIndex]);
    });
  });
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading tasks file" });

    let tasks = JSON.parse(data);
    let filteredTasks = tasks.filter((task) => task.id !== taskId);

    fs.writeFile(DATA_FILE, JSON.stringify(filteredTasks, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error writing tasks file" });
      res.json({ message: "Task deleted" });
    });
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
