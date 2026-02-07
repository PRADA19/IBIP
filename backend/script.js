const API_URL = "https://ibip-nlcj.onrender.com/tasks";

const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskContainer");


// ================= LOAD TASKS ON START =================
window.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
});


// ================= GET TASKS =================
async function fetchTasks(retry = 5) {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error();

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

        // silently retry (NO ALERT)
        if (retry > 0) {
            console.log("Backend waking... retrying");
            setTimeout(() => fetchTasks(retry - 1), 2500);
        } else {
            taskContainer.innerHTML = "⚡ Server starting... please wait";
        }
    }
}


// ================= ADD TASK =================
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


// ================= COMPLETE TASK =================
async function completeTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    fetchTasks();
}


// ================= DELETE TASK =================
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}
