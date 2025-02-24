document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('tasks');
    const completedTaskList = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text priority-${task.priority}">${task.text}</span>
                <div class="task-buttons">
                    <button class="complete-button">Complete</button>
                    <button class="remove-button">Remove</button>
                </div>
            `;
            taskList.appendChild(li);

            li.querySelector('.complete-button').addEventListener('click', () => completeTask(index));
            li.querySelector('.remove-button').addEventListener('click', () => removeTask(index));
        });
    }

    function renderCompletedTasks() {
        if (completedTaskList) {
            completedTaskList.innerHTML = '';
            completedTasks.forEach((task) => {
                const li = document.createElement('li');
                li.textContent = task.text;
                completedTaskList.appendChild(li);
            });
        }
    }

    function addTask() {
        const text = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (text) {
            tasks.push({ text, priority });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            taskInput.value = '';
        }
    }

    function completeTask(index) {
        const completedTask = tasks.splice(index, 1)[0];
        completedTasks.push(completedTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        renderTasks();
        renderCompletedTasks();
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    addButton.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
    renderCompletedTasks();

    if (window.location.pathname.endsWith('completed.html')) {
        document.querySelector('nav a[href="completed.html"]').classList.add('active');
    } else if (window.location.pathname.endsWith('about.html')){
        document.querySelector('nav a[href="about.html"]').classList.add('active');
    } else {
        document.querySelector('nav a[href="index.html"]').classList.add('active');
    }
});