document.addEventListener('DOMContentLoaded', function() {
    let taskId = 8;
    
    // Function to update task counts in each column
    function updateTaskCounts() {
        document.querySelectorAll('.task-column').forEach(column => {
            const count = column.querySelectorAll('.task-card').length;
            column.querySelector('.task-count').textContent = count;
        });
    }
    
    // Function to attach event listeners to a task card
    function attachTaskEventListeners(taskCard) {
        // Move/Complete button
        const moveBtn = taskCard.querySelector('.move, .complete');
        if (moveBtn) {
            moveBtn.addEventListener('click', function() {
                const targetStatus = this.getAttribute('data-target');
                const targetColumn = document.querySelector(`.task-column:nth-child(${
                    targetStatus === 'in-progress' ? 2 : targetStatus === 'done' ? 3 : 1
                }) .task-list`);
                
                if (targetColumn) {
                    // Clone the task card
                    const newTaskCard = taskCard.cloneNode(true);
                    
                    // Update the task class and buttons based on new status
                    newTaskCard.className = 'task-card';
                    if (targetStatus === 'in-progress') {
                        newTaskCard.classList.add('in-progress');
                        const moveBtn = newTaskCard.querySelector('.move');
                        if (moveBtn) {
                            moveBtn.className = 'task-btn complete';
                            moveBtn.innerHTML = '<i class="fas fa-check"></i> Complete';
                            moveBtn.setAttribute('data-target', 'done');
                        }
                    } else if (targetStatus === 'done') {
                        newTaskCard.classList.add('done');
                        const completeBtn = newTaskCard.querySelector('.complete');
                        if (completeBtn) {
                            completeBtn.remove();
                        }
                    }
                    
                    // Add to target column and remove from current
                    targetColumn.appendChild(newTaskCard);
                    taskCard.remove();
                    
                    // Update task counts
                    updateTaskCounts();
                    
                    // Reattach event listeners
                    attachTaskEventListeners(newTaskCard);
                }
            });
        }
        
        // Delete button
        const deleteBtn = taskCard.querySelector('.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                taskCard.remove();
                updateTaskCounts();
            });
        }
    }
    
    // Initialize all existing task cards
    document.querySelectorAll('.task-card').forEach(taskCard => {
        attachTaskEventListeners(taskCard);
    });
    
    // Add new task form submission
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-desc').value.trim();
        const project = document.getElementById('task-project').value;
        const deadline = document.getElementById('task-deadline').value;
        
        if (title) {
            const todoColumn = document.querySelector('.task-column:first-child .task-list');
            
            const newTaskCard = document.createElement('div');
            newTaskCard.className = 'task-card todo';
            newTaskCard.setAttribute('data-id', taskId++);
            
            let deadlineText = '';
            if (deadline) {
                const deadlineDate = new Date(deadline);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffTime = deadlineDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 0) {
                    deadlineText = 'Due Today';
                } else if (diffDays === 1) {
                    deadlineText = 'Due Tomorrow';
                } else if (diffDays < 0) {
                    deadlineText = 'Overdue';
                } else {
                    deadlineText = `Due in ${diffDays} days`;
                }
            }
            
            newTaskCard.innerHTML = `
                <div class="task-title">${title}</div>
                <div class="task-desc">${description}</div>
                <div class="task-meta">
                    <div class="task-deadline ${deadlineText.includes('Today') || deadlineText.includes('Tomorrow') || deadlineText.includes('Overdue') ? 'urgent' : ''}">${deadlineText || 'No deadline'}</div>
                    <div class="task-project">${project}</div>
                </div>
                <div class="task-actions">
                    <button class="task-btn move" data-target="in-progress">
                        <i class="fas fa-arrow-right"></i>
                        Move
                    </button>
                    <button class="task-btn delete">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            `;
            
            todoColumn.appendChild(newTaskCard);
            taskForm.reset();
            updateTaskCounts();
            attachTaskEventListeners(newTaskCard);
        }
    });
    
    // Initialize task counts
    updateTaskCounts();
});