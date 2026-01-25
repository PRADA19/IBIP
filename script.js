const API_URL = "http://localhost:5000/tasks";

const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");

window.onload = fetchTasks;

// GET
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    taskContainer.innerHTML = "";

    tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
            <span style="text-decoration:${task.completed ? 'line-through' : 'none'}">
                ${task.title}
            </span>
            <div>
                <button onclick="completeTask('${task._id}')">Completed</button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;

        taskContainer.appendChild(div);
    });
}

// POST
async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    taskInput.value = "";
    fetchTasks();
}

// PUT
async function completeTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    fetchTasks();
}

// DELETE
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}
