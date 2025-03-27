const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const app = express();

const PORT = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "1234",
  port: 5432,
});

app.use(express.static(__dirname));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Mainpage.html"));
});

app.get("/Mainpage(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "Mainpage.html"));
});

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    const formattedTasks = result.rows.map((task) => ({
      ...task,
      date: task.date.toISOString().split("T")[0],
    }));
    res.json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  const { task, description, date, completed } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (task, description, date, completed) VALUES ($1, $2, $3, $4) RETURNING *",
      [task, description, date, completed]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
