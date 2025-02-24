document.addEventListener('DOMContentLoaded', () => {
    const todayTaskList = document.getElementById('today-task-list');
    const upcomingTaskList = document.getElementById('upcoming-task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const addUpcomingTaskBtn = document.getElementById('add-upcoming-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const newUpcomingTaskInput = document.getElementById('new-upcoming-task-input');

    const todayBtn = document.getElementById('today-btn');
    const upcomingBtn = document.getElementById('upcoming-btn');
    const completedBtn = document.getElementById('completed-btn');
    const todaySection = document.getElementById('today');
    const upcomingSection = document.getElementById('upcoming');
    const completedSection = document.getElementById('completed');


    let tasks = {
        today: [],
        upcoming: [],
        completed: []
    };

    // Load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


    // --- Task Rendering ---
    function renderTasks() {
        todayTaskList.innerHTML = '';
        upcomingTaskList.innerHTML = '';
        completedTaskList.innerHTML = '';

        renderTaskList(tasks.today, todayTaskList, 'today');
        renderTaskList(tasks.upcoming, upcomingTaskList, 'upcoming');
        renderTaskList(tasks.completed, completedTaskList, 'completed');
    }

    function renderTaskList(taskList, listElement, taskType) {
        taskList.forEach((task, index) => {
            const listItem = createTaskElement(task, index, taskType);
            listElement.appendChild(listItem);
        });
    }

    function createTaskElement(task, index, taskType) {
        const listItem = document.createElement('li');
        listItem.classList.add(`priority-${task.priority}`);
        if (task.completed) {
            listItem.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        listItem.appendChild(taskText);

        const taskControls = document.createElement('div');
        taskControls.classList.add('task-controls');

        // Priority buttons
        const priorityUpBtn = document.createElement('button');
        priorityUpBtn.textContent = '↑';
        priorityUpBtn.title = "Increase Priority";
        priorityUpBtn.addEventListener('click', () => changePriority(taskType, index, 'up'));

        const priorityDownBtn = document.createElement('button');
        priorityDownBtn.textContent = '↓';
        priorityDownBtn.title = "Decrease Priority";
        priorityDownBtn.addEventListener('click', () => changePriority(taskType, index, 'down'));


        // Complete/Incomplete button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? '↺' : '✓'; // Undo or Checkmark
        completeBtn.title = task.completed ? "Mark Incomplete" : "Mark Complete";
        completeBtn.addEventListener('click', () => toggleComplete(taskType, index));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.title = "Delete Task";
        deleteBtn.addEventListener('click', () => deleteTask(taskType, index));

        if (taskType !== 'completed') {
            taskControls.appendChild(priorityUpBtn);
            taskControls.appendChild(priorityDownBtn);
        }

        taskControls.appendChild(completeBtn);
        taskControls.appendChild(deleteBtn);
        listItem.appendChild(taskControls);

        return listItem;
    }


    // --- Task Management Functions ---

    function addTask(taskText, taskType) {
        if (taskText.trim() === '') return;

        const newTask = {
            text: taskText,
            completed: false,
            priority: 'medium' // Default priority
        };

        tasks[taskType].push(newTask);
        saveTasks();
        renderTasks();
        if (taskType === 'today') {
            newTaskInput.value = '';
        } else {
            newUpcomingTaskInput.value = '';
        }

    }

    function deleteTask(taskType, index) {
        tasks[taskType].splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function toggleComplete(taskType, index) {
        const task = tasks[taskType][index];
        task.completed = !task.completed;

        if (taskType !== 'completed' && task.completed) {
            // Move to completed list
            tasks.completed.push(task);
            tasks[taskType].splice(index, 1);
        } else if (taskType === 'completed' && !task.completed) {
            //Move back to today
            tasks.today.push(task);
            tasks.completed.splice(index, 1);
        }

        saveTasks();
        renderTasks();
    }

    function changePriority(taskType, index, direction) {
        const task = tasks[taskType][index];
        const priorities = ['low', 'medium', 'high'];
        let currentPriorityIndex = priorities.indexOf(task.priority);

        if (direction === 'up' && currentPriorityIndex < priorities.length - 1) {
            task.priority = priorities[currentPriorityIndex + 1];
        } else if (direction === 'down' && currentPriorityIndex > 0) {
            task.priority = priorities[currentPriorityIndex - 1];
        }

        saveTasks();
        renderTasks();
    }


    // --- Event Listeners ---

    addTaskBtn.addEventListener('click', () => addTask(newTaskInput.value, 'today'));
    addUpcomingTaskBtn.addEventListener('click', () => addTask(newUpcomingTaskInput.value, 'upcoming'));

    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(newTaskInput.value, 'today');
        }
    });
    newUpcomingTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(newUpcomingTaskInput.value, 'upcoming');
        }
    });

    // Navigation
    todayBtn.addEventListener('click', () => {
        todaySection.style.display = 'block';
        upcomingSection.style.display = 'none';
        completedSection.style.display = 'none';
        todayBtn.classList.add('active');
        upcomingBtn.classList.remove('active');
        completedBtn.classList.remove('active');
    });

    upcomingBtn.addEventListener('click', () => {
        todaySection.style.display = 'none';
        upcomingSection.style.display = 'block';
        completedSection.style.display = 'none';
        todayBtn.classList.remove('active');
        upcomingBtn.classList.add('active');
        completedBtn.classList.remove('active');
    });

    completedBtn.addEventListener('click', () => {
        todaySection.style.display = 'none';
        upcomingSection.style.display = 'none';
        completedSection.style.display = 'block';
        todayBtn.classList.remove('active');
        upcomingBtn.classList.remove('active');
        completedBtn.classList.add('active');
    });


    // Initial setup
    loadTasks();

});