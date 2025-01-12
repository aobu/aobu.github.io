const addTask = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

loadTasks();

function createTask() {
    const task = taskInput.value.trim();

    if (task) {
        createTaskElement(task);
        taskInput.value = "";
        saveTasks();
    }
}

addTask.addEventListener("click", createTask);

function createTaskElement(task) {
    const listItem = document.createElement('li');
    listItem.textContent = task;


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'DESTROY';
    deleteButton.className = 'deleteTask';
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(listItem);
        saveTasks();
    });

    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(function (item) {
        tasks.push(item.firstChild.textContent);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(createTaskElement);
}
