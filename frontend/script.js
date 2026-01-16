const API = "http://localhost:5000/tasks";

window.onload = loadTasks;

// Load tasks from DB
async function loadTasks() {
    const res = await fetch(API);
    const tasks = await res.json();

    const container = document.getElementById("taskContainer");
    container.innerHTML = "";

    tasks.forEach(task => createTask(task));
}

// Add task
async function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();
    if (!title) return;

    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    const task = await res.json();
    createTask(task);
    input.value = "";
}

// Create task UI
function createTask(task) {
    const container = document.getElementById("taskContainer");

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    const span = document.createElement("span");
    span.innerText = task.title;
    if (task.completed) span.style.textDecoration = "line-through";

    // Completed button
    const completeBtn = document.createElement("button");
    completeBtn.innerText = "Completed";
    completeBtn.onclick = async () => {
        await fetch(`${API}/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true })
        });
        span.style.textDecoration = "line-through";
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = async () => {
        await fetch(`${API}/${task._id}`, { method: "DELETE" });
        taskDiv.remove();
    };

    taskDiv.appendChild(span);
    taskDiv.appendChild(completeBtn);
    taskDiv.appendChild(deleteBtn);
    container.appendChild(taskDiv);
}
