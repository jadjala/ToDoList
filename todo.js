document.addEventListener('DOMContentLoaded', function() {
    let taskId = 8; // Start after the initial tasks
    
    // Set up move buttons
    function setupMoveButtons(buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const section = this.closest('.section');
                const targetSectionId = this.getAttribute('data-target');
                const targetSection = document.getElementById(`${targetSectionId}-section`);
                
                if (targetSection) {
                    const newSection = section.cloneNode(true);
                    const oldMoveButton = newSection.querySelector('.move-btn');
                    const deleteButton = newSection.querySelector('.delete-btn');
                    
                    if (targetSectionId === 'in-progress') {
                        oldMoveButton.textContent = 'Move to Done';
                        oldMoveButton.setAttribute('data-target', 'done');
                        oldMoveButton.style.backgroundColor = '#b30000';
                    } else if (targetSectionId === 'done') {
                        newSection.removeChild(oldMoveButton);
                    }
                    
                    targetSection.appendChild(newSection);
                    section.parentNode.removeChild(section);
                    
                    setupDeleteButton(deleteButton);
                    if (oldMoveButton) setupMoveButtons([oldMoveButton]);
                }
            });
        });
    }
    
    // Set up delete buttons
    function setupDeleteButton(button) {
        button.addEventListener('click', function() {
            const section = this.closest('.section');
            section.parentNode.removeChild(section);
        });
    }
    
    // Initialize existing buttons
    setupMoveButtons(document.querySelectorAll('.move-btn'));
    document.querySelectorAll('.delete-btn').forEach(btn => setupDeleteButton(btn));
    
    // Add new task functionality
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskTitle = document.getElementById('new-task-title');
    const newTaskDesc = document.getElementById('new-task-desc');
    
    function addNewTask() {
        const title = newTaskTitle.value.trim();
        const description = newTaskDesc.value.trim();
        
        if (title) {
            const newSection = document.createElement('div');
            newSection.className = 'section';
            newSection.setAttribute('data-id', taskId++);
            
            newSection.innerHTML = `
                <h2>${title}</h2>
                ${description ? `<p>${description}</p>` : ''}
                <button class="move-btn" data-target="in-progress">Move to In Progress</button>
                <button class="delete-btn">Delete</button>
            `;
            
            document.getElementById('todo-section').appendChild(newSection);
            
            // Clear inputs
            newTaskTitle.value = '';
            newTaskDesc.value = '';
            
            // Set up event listeners for new buttons
            setupMoveButtons([newSection.querySelector('.move-btn')]);
            setupDeleteButton(newSection.querySelector('.delete-btn'));
        }
    }
    
    addTaskBtn.addEventListener('click', addNewTask);
    
    // Also allow adding with Enter key
    newTaskTitle.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewTask();
    });
    
    newTaskDesc.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewTask();
    });
    
    // Deadline highlighting
    const now = new Date();
    document.querySelectorAll('p').forEach(deadline => {
        const text = deadline.textContent;
        if (text.includes('Deadline:') || text.includes('Finish on')) {
            const dateText = text.match(/[A-Za-z]+\s\d{1,2},\s\d{4}/);
            if (dateText) {
                const deadlineDate = new Date(dateText[0]);
                if (deadlineDate < now) {
                    deadline.style.color = '#ff4444';
                    deadline.style.fontWeight = 'bold';
                }
            }
        }
    });
});