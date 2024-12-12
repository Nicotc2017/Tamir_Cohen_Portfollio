// Initialize AOS
AOS.init();

// Initialize Dragula for drag-and-drop
const drake = dragula([document.getElementById('inProgressTable').querySelector('tbody'), document.getElementById('completedTable').querySelector('tbody')]);

// Task Arrays
let tasks = [];
let completedTasks = [];

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const dueDateInput = document.getElementById('dueDate');
const urgencyInput = document.getElementById('urgency');
const taskIdInput = document.getElementById('taskId');
const inProgressTableBody = document.getElementById('inProgressTable').querySelector('tbody');
const completedTableBody = document.getElementById('completedTable').querySelector('tbody');
const progressBar = document.getElementById('progressBar');
const alertPlaceholder = document.getElementById('alertPlaceholder');
const darkModeToggle = document.getElementById('darkModeToggle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchTaskInput = document.getElementById('searchTask');
const filterUrgencySelect = document.getElementById('filterUrgency');
const inProgressCount = document.getElementById('inProgressCount');
const completedCount = document.getElementById('completedCount');
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const confirmActionBtn = document.getElementById('confirmActionBtn');
let actionToConfirm = null;

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateProgress();
    updateTaskCounts();
});

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    const storedCompleted = JSON.parse(localStorage.getItem('completedTasks'));
    if (storedTasks) {
        tasks = storedTasks;
        tasks.forEach(task => appendTask(task, 'inProgress'));
    }
    if (storedCompleted) {
        completedTasks = storedCompleted;
        completedTasks.forEach(task => appendTask(task, 'completed'));
    }
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Add Task Event
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    const urgency = urgencyInput.value;
    const id = taskIdInput.value;

    if (id) {
        // Edit existing task
        const taskIndex = tasks.findIndex(t => t.id == id);
        if (taskIndex > -1) {
            tasks[taskIndex] = { id: parseInt(id), name, dueDate, urgency };
            updateTaskRow(tasks[taskIndex], 'inProgress');
            showAlert('Task updated successfully!', 'success');
        } else {
            const completedIndex = completedTasks.findIndex(t => t.id == id);
            if (completedIndex > -1) {
                completedTasks[completedIndex] = { id: parseInt(id), name, dueDate, urgency };
                updateTaskRow(completedTasks[completedIndex], 'completed');
                showAlert('Task updated successfully!', 'success');
            }
        }
        taskIdInput.value = '';
        submitBtn.textContent = 'Add Task';
        cancelEditBtn.classList.add('d-none');
    } else {
        // Add new task
        const task = {
            id: Date.now(),
            name,
            dueDate,
            urgency
        };
        tasks.push(task);
        appendTask(task, 'inProgress');
        showAlert('Task added successfully!', 'success');
    }

    saveTasks();
    updateProgress();
    updateTaskCounts();
    taskForm.reset();
});

// Append Task to Table
function appendTask(task, category) {
    const tableBody = category === 'inProgress' ? inProgressTableBody : completedTableBody;
    const row = tableBody.insertRow();
    row.setAttribute('data-id', task.id);
    row.innerHTML = `
        <td>${escapeHTML(task.name)}</td>
        <td>${task.dueDate}</td>
        <td class="urgency-${task.urgency}">${capitalize(task.urgency)}</td>
        <td>
            <button class="btn btn-secondary btn-sm btn-edit" aria-label="Edit task">Edit</button>
            ${category === 'inProgress' ? `<button class="btn btn-success btn-sm btn-done" aria-label="Mark as done">Done</button>` : ''}
            <button class="btn btn-danger btn-sm btn-delete" aria-label="Delete task">Delete</button>
        </td>
    `;
    applyGSAP(row);
}

// Update Task Row after editing
function updateTaskRow(task, category) {
    const tableBody = category === 'inProgress' ? inProgressTableBody : completedTableBody;
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.getAttribute('data-id') == task.id) {
            row.children[0].textContent = task.name;
            row.children[1].textContent = task.dueDate;
            row.children[2].className = `urgency-${task.urgency}`;
            row.children[2].textContent = capitalize(task.urgency);
        }
    });
}

// Capitalize Function
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>"'`=\/]/g, function(s) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return entityMap[s];
    });
}

// Apply GSAP Animation
function applyGSAP(element) {
    gsap.from(element, { duration: 0.5, opacity: 0, y: -20 });
}

// Update Progress Meter
function updateProgress() {
    const total = tasks.length + completedTasks.length;
    const completed = completedTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${percentage}%`;
}

// Show Alert Message
function showAlert(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertPlaceholder.append(wrapper);
    // Automatically remove the alert after 3 seconds
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(wrapper.querySelector('.alert'));
        alert.close();
    }, 3000);
}

// Table Action Events with Event Delegation
[inProgressTableBody, completedTableBody].forEach(tableBody => {
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-edit')) {
            editTask(e);
        } else if (e.target.classList.contains('btn-done')) {
            initiateCompleteTask(e);
        } else if (e.target.classList.contains('btn-delete')) {
            initiateDeleteTask(e);
        }
    });
});

// Edit Task
function editTask(e) {
    const row = e.target.closest('tr');
    const taskId = row.getAttribute('data-id');
    const task = tasks.find(t => t.id == taskId) || completedTasks.find(t => t.id == taskId);
    if (task) {
        taskNameInput.value = task.name;
        dueDateInput.value = task.dueDate;
        urgencyInput.value = task.urgency;
        taskIdInput.value = task.id;
        submitBtn.textContent = 'Update Task';
        cancelEditBtn.classList.remove('d-none');
        scrollToForm();
    }
}

// Cancel Edit Mode
cancelEditBtn.addEventListener('click', function() {
    taskForm.reset();
    taskIdInput.value = '';
    submitBtn.textContent = 'Add Task';
    cancelEditBtn.classList.add('d-none');
    showAlert('Edit cancelled.', 'info');
});

// Initiate Complete Task (with confirmation)
function initiateCompleteTask(e) {
    const row = e.target.closest('tr');
    const taskId = row.getAttribute('data-id');
    actionToConfirm = () => completeTask(taskId);
    document.getElementById('modalBody').textContent = 'Are you sure you want to mark this task as completed?';
    confirmActionBtn.textContent = 'Yes, mark as done';
    confirmationModal.show();
}

// Complete Task
function completeTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex > -1) {
        const task = tasks.splice(taskIndex, 1)[0];
        completedTasks.push(task);
        moveTaskRow(taskId, 'inProgress', 'completed');
        saveTasks();
        updateProgress();
        updateTaskCounts();
        showAlert('Task marked as completed!', 'success');
    }
}

// Initiate Delete Task (with confirmation)
function initiateDeleteTask(e) {
    const row = e.target.closest('tr');
    const taskId = row.getAttribute('data-id');
    actionToConfirm = () => deleteTask(taskId, row);
    document.getElementById('modalBody').textContent = 'Are you sure you want to delete this task? This action cannot be undone.';
    confirmActionBtn.textContent = 'Yes, delete';
    confirmationModal.show();
}

// Delete Task
function deleteTask(taskId, row) {
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
    } else {
        const completedIndex = completedTasks.findIndex(t => t.id == taskId);
        if (completedIndex > -1) {
            completedTasks.splice(completedIndex, 1);
        }
    }
    row.remove();
    saveTasks();
    updateProgress();
    updateTaskCounts();
    showAlert('Task deleted successfully!', 'warning');
}

// Confirm Action Button Click
confirmActionBtn.addEventListener('click', function() {
    if (actionToConfirm && typeof actionToConfirm === 'function') {
        actionToConfirm();
        actionToConfirm = null;
        confirmationModal.hide();
    }
});

// Move Task Row between tables
function moveTaskRow(taskId, fromCategory, toCategory) {
    const fromTableBody = fromCategory === 'inProgress' ? inProgressTableBody : completedTableBody;
    const toTableBody = toCategory === 'inProgress' ? inProgressTableBody : completedTableBody;
    const row = fromTableBody.querySelector(`tr[data-id='${taskId}']`);
    if (row) {
        row.remove();
        // Update actions
        let actionButtons = '';
        if (toCategory === 'inProgress') {
            actionButtons = `
                <button class="btn btn-secondary btn-sm btn-edit" aria-label="Edit task">Edit</button>
                <button class="btn btn-success btn-sm btn-done" aria-label="Mark as done">Done</button>
                <button class="btn btn-danger btn-sm btn-delete" aria-label="Delete task">Delete</button>
            `;
        } else {
            actionButtons = `
                <button class="btn btn-secondary btn-sm btn-edit" aria-label="Edit task">Edit</button>
                <button class="btn btn-danger btn-sm btn-delete" aria-label="Delete task">Delete</button>
            `;
        }
        row.innerHTML = `
            <td>${row.children[0].textContent}</td>
            <td>${row.children[1].textContent}</td>
            <td>${row.children[2].outerHTML}</td>
            <td>${actionButtons}</td>
        `;
        toTableBody.appendChild(row);
        applyGSAP(row);
    }
}

// Search and Filter Functionality
searchTaskInput.addEventListener('input', filterTasks);
filterUrgencySelect.addEventListener('change', filterTasks);

function filterTasks() {
    const searchTerm = searchTaskInput.value.toLowerCase();
    const filterUrgency = filterUrgencySelect.value;

    [inProgressTableBody, completedTableBody].forEach(tableBody => {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const taskName = row.children[0].textContent.toLowerCase();
            const taskUrgency = row.children[2].textContent.toLowerCase();
            const matchesSearch = taskName.includes(searchTerm);
            const matchesUrgency = filterUrgency === 'all' || taskUrgency.startsWith(filterUrgency);
            if (matchesSearch && matchesUrgency) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Update Task Counts
function updateTaskCounts() {
    inProgressCount.textContent = `(${tasks.length})`;
    completedCount.textContent = `(${completedTasks.length})`;
}

// Dark Mode Toggle
darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Drag-and-Drop Events
drake.on('drop', function(el, target, source, sibling) {
    const taskId = el.getAttribute('data-id');
    if (target.id === 'completedTable') {
        // Move to completed
        const taskIndex = tasks.findIndex(t => t.id == taskId);
        if (taskIndex > -1) {
            const task = tasks.splice(taskIndex, 1)[0];
            completedTasks.push(task);
            saveTasks();
            updateProgress();
            updateTaskCounts();
            showAlert('Task marked as completed via drag-and-drop!', 'success');
            // Update actions
            const actionButtons = `
                <button class="btn btn-secondary btn-sm btn-edit" aria-label="Edit task">Edit</button>
                <button class="btn btn-danger btn-sm btn-delete" aria-label="Delete task">Delete</button>
            `;
            el.querySelector('td:last-child').innerHTML = actionButtons;
        }
    } else if (target.id === 'inProgressTable') {
        // Move back to in-progress
        const taskIndex = completedTasks.findIndex(t => t.id == taskId);
        if (taskIndex > -1) {
            const task = completedTasks.splice(taskIndex, 1)[0];
            tasks.push(task);
            saveTasks();
            updateProgress();
            updateTaskCounts();
            showAlert('Task moved back to in progress via drag-and-drop.', 'info');
            // Update actions
            const actionButtons = `
                <button class="btn btn-secondary btn-sm btn-edit" aria-label="Edit task">Edit</button>
                <button class="btn btn-success btn-sm btn-done" aria-label="Mark as done">Done</button>
                <button class="btn btn-danger btn-sm btn-delete" aria-label="Delete task">Delete</button>
            `;
            el.querySelector('td:last-child').innerHTML = actionButtons;
        }
    }
});

// Scroll to form when editing
function scrollToForm() {
    taskForm.scrollIntoView({ behavior: 'smooth' });
}