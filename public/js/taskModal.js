function openTaskModal(
  id,
  title,
  description,
  priority,
  dueDate,
  status,
  subtasks,
  comments,
  worklog,
  listId
) {
  const modal = document.getElementById('taskModal');
  const modalContent = modal.querySelector('.bg-white');

  // Reset animation classes
  modal.classList.remove('opacity-0');
  modalContent.classList.remove('scale-95');

  // Show modal with animation
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('opacity-100');
    modalContent.classList.add('scale-100');
  }, 10);

  // Populate fields
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('taskId').value = id;
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  document.getElementById('priority').value = priority;
  document.getElementById('dueDate').value = dueDate;
  document.getElementById('status').value = status;
  document.getElementById('listId').value = listId;

  // Populate subtasks
  const subtasksContainer = document.getElementById('subtasksContainer');
  subtasksContainer.innerHTML = '';
  subtasks.forEach((subtask, index) => {
    addSubtask(subtask.title, subtask.description, subtask.status, index);
  });

  // Populate comments
  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = '';
  comments.forEach((comment) => {
    const div = document.createElement('div');
    div.className = 'text-sm text-gray-600';
    div.textContent = `${comment.text} (${new Date(
      comment.createdAt
    ).toLocaleString()})`;
    commentsContainer.appendChild(div);
  });

  // Populate worklog
  const worklogContainer = document.getElementById('worklogContainer');
  worklogContainer.innerHTML = '';
  worklog.forEach((log) => {
    const div = document.createElement('div');
    div.className = 'text-sm text-gray-600';
    div.textContent = `${log.duration} minutes ${
      log.description ? `(${log.description})` : ''
    } (${new Date(log.createdAt).toLocaleString()})`;
    worklogContainer.appendChild(div);
  });

  // Set form action
  document.getElementById('taskForm').action = `/tasks/update/${id}`;

  // Show comments tab by default
  showTab('comments');
}

function closeTaskModal() {
  const modal = document.getElementById('taskModal');
  const modalContent = modal.querySelector('.bg-white');

  // Animate out
  modal.classList.remove('opacity-100');
  modalContent.classList.remove('scale-100');
  modal.classList.add('opacity-0');
  modalContent.classList.add('scale-95');

  // Hide after animation
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

function addSubtask(
  title = '',
  description = '',
  status = 'pending',
  index = null
) {
  const subtasksContainer = document.getElementById('subtasksContainer');
  const subtaskDiv = document.createElement('div');
  subtaskDiv.className =
    'flex flex-col space-y-2 p-3 bg-white rounded-lg border border-gray-200';
  // Use userType from global scope or DOM to determine theme
  const userType =
    document
      .querySelector('h1')
      .textContent.match(/\((\w+)\)/)?.[1]
      .toLowerCase() || 'student';
  const themes = {
    student: 'text-indigo-600 focus:ring-indigo-500',
    professional: 'text-teal-600 focus:ring-teal-500',
    religious: 'text-purple-600 focus:ring-purple-500',
  };
  const themeClass = themes[userType];
  subtaskDiv.innerHTML = `
    <div class="flex items-center space-x-3">
      <input type="checkbox" name="subtasks[status][]" value="done" ${
        status === 'done' ? 'checked' : ''
      } class="h-4 w-4 ${themeClass} border-gray-300 rounded">
      <input type="text" name="subtasks[title][]" value="${title}" placeholder="Subtask Title" required class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
    themeClass.split(' ')[1]
  } bg-white">
      <button type="button" onclick="this.parentElement.parentElement.remove()" class="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
    </div>
    <textarea name="subtasks[description][]" placeholder="Subtask Description" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
      themeClass.split(' ')[1]
    } bg-white resize-none">${description}</textarea>
  `;
  subtasksContainer.appendChild(subtaskDiv);
}

function showTab(tabName) {
  const commentsTab = document.getElementById('commentsTab');
  const worklogTab = document.getElementById('worklogTab');
  const commentsButton = document.querySelector('.comments-tab');
  const worklogButton = document.querySelector('.worklog-tab');

  // Determine theme based on userType
  const userType =
    document
      .querySelector('h1')
      .textContent.match(/\((\w+)\)/)?.[1]
      .toLowerCase() || 'student';
  const tabThemes = {
    student: 'border-indigo-500',
    professional: 'border-teal-500',
    religious: 'border-purple-500',
  };
  const tabTheme = tabThemes[userType];

  if (tabName === 'comments') {
    commentsTab.classList.remove('hidden');
    worklogTab.classList.add('hidden');
    commentsButton.classList.add(tabTheme);
    worklogButton.classList.remove(tabTheme);
  } else {
    commentsTab.classList.add('hidden');
    worklogTab.classList.remove('hidden');
    commentsButton.classList.remove(tabTheme);
    worklogButton.classList.add(tabTheme);
  }
}

async function updateTaskField(element, field) {
  const taskId = document.getElementById('taskId').value;
  const value = element.value;

  try {
    const response = await fetch(`/tasks/update/${taskId}/field`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, value }),
    });

    const result = await response.json();
    if (!result.success) {
      Toastify({
        text: `Failed to update task field: ${result.error}`,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#f56565', // Red
      }).showToast();
    }
  } catch (err) {
    Toastify({
      text: 'Error updating task field. Please try again.',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#f56565', // Red
    }).showToast();
  }
}
