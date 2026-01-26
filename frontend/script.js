// ================= BACKEND URL =================
const API_URL = "https://ibip-nlcj.onrender.com"; // 🔥 YOUR RENDER BACKEND

// ================= SELECT ELEMENTS =================
const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");
const addBtn = document.getElementById("addBtn");
const searchBtn = document.getElementById("searchBtn");

// ================= FETCH AND RENDER TASKS =================
async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");

    const tasks = await res.json();
    taskContainer.innerHTML = "";

    tasks.forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task task-item";
      taskDiv.style.display = "flex";
      taskDiv.style.alignItems = "center";
      taskDiv.style.justifyContent = "space-between";
      taskDiv.style.marginBottom = "10px";

      const title = document.createElement("span");
      title.textContent = task.title;
      title.style.flex = "1";
      title.style.marginRight = "10px";
      title.style.textDecoration = task.completed ? "line-through" : "none";
      title.style.color = task.completed ? "gray" : "black";

      const completeBtn = document.createElement("button");
      completeBtn.textContent = task.completed ? "Undo" : "Complete";
      completeBtn.style.marginRight = "5px";
      completeBtn.onclick = () => toggleComplete(task._id, !task.completed);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteTask(task._id);

      taskDiv.appendChild(title);
      taskDiv.appendChild(completeBtn);
      taskDiv.appendChild(deleteBtn);
      taskContainer.appendChild(taskDiv);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to fetch tasks. Check backend connection.");
  }
}

// ================= ADD TASK =================
async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return alert("Please enter a task");

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Failed to add task");

    taskInput.value = "";
    fetchTasks();
  } catch (err) {
    console.error(err);
    alert("Failed to add task. Check backend connection.");
  }
}

// ================= TOGGLE COMPLETE =================
async function toggleComplete(id, completed) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) throw new Error("Failed to update task");
    fetchTasks();
  } catch (err) {
    console.error(err);
    alert("Failed to update task");
  }
}

// ================= DELETE TASK =================
async function deleteTask(id) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task");
    fetchTasks();
  } catch (err) {
    console.error(err);
    alert("Failed to delete task");
  }
}

// ================= SEARCH TASK =================
searchBtn.addEventListener("click", () => {
  const text = taskInput.value.trim().toLowerCase();
  if (!text) return;

  const taskElements = document.querySelectorAll(".task-item");
  let found = false;

  taskElements.forEach(taskEl => {
    const titleEl = taskEl.querySelector("span");
    if (titleEl && titleEl.textContent.trim().toLowerCase() === text) {
      found = true;
      taskEl.classList.add("blink");
      setTimeout(() => taskEl.classList.remove("blink"), 800);
    }
  });

  if (!found) alert("Task not found ❌");
});

// ================= EVENTS =================
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// ================= INITIAL LOAD =================
fetchTasks();
