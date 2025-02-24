document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');
    const themeToggle = document.getElementById('themeToggle');

    // Theme Toggle
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
    });


    addTaskBtn.addEventListener('click', addTask);

    taskList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            toggleComplete(event.target);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteTask(event.target.parentElement);
        }
    });

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        if (taskText !== '') {
            const listItem = document.createElement('li');

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = taskText;
            taskTextSpan.classList.add(`priority-${priority}`); // Add priority class
            listItem.appendChild(taskTextSpan);


            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            listItem.appendChild(deleteBtn);
            taskList.appendChild(listItem);
            taskInput.value = '';
        }
    }

    function toggleComplete(taskItem) {
        taskItem.classList.toggle('completed');
    }

    function deleteTask(taskItem) {
        taskList.removeChild(taskItem);
    }

     // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    // Theme Toggle with Local Storage
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

});