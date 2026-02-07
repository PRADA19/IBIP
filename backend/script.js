const API_URL = "https://ibip-nlcj.onrender.com/tasks";

const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");

// Load tasks when page opens
window.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
});


// ================= GET TASKS =================
async function fetchTasks(retry = 3) {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Fetch failed");

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

    } catch (err) {
        console.log("Backend sleeping... retrying");

        if (retry > 0) {
            setTimeout(() => fetchTasks(retry - 1), 3000);
        } else {
            alert("Backend is waking up. Please refresh once.");
        }
    }
}


// ================= ADD TASK =================
async function addTask() {
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });

        taskInput.value = "";
        fetchTasks();

    } catch (err) {
        alert("Failed to add task");
    }
}


// ================= COMPLETE TASK =================
async function completeTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "PUT" });
        fetchTasks();
    } catch {
        alert("Failed to update task");
    }
}


// ================= DELETE TASK =================
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchTasks();
    } catch {
        alert("Failed to delete task");
    }
}
