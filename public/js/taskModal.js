function openTaskModal(
  id,
  title,
  description,
  priority,
  dueDate,
  status,
  subtasks,
  comments,
  worklog
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
  document.getElementById('description').value = description;
  document.getElementById('priority').value = priority;
  document.getElementById('dueDate').value = dueDate;
  document.getElementById('status').value = status;

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
  subtaskDiv.className = 'flex items-center space-x-2 border p-2 rounded-md';
  subtaskDiv.innerHTML = `
    <input type="checkbox" name="subtasks[status][]" value="done" ${
      status === 'done' ? 'checked' : ''
    } class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
    <input type="text" name="subtasks[title][]" value="${title}" placeholder="Subtask Title" required class="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600">
    <textarea name="subtasks[description][]" placeholder="Subtask Description" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600">${description}</textarea>
    <button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700">Remove</button>
  `;
  subtasksContainer.appendChild(subtaskDiv);
}

function showTab(tabName) {
  const commentsTab = document.getElementById('commentsTab');
  const worklogTab = document.getElementById('worklogTab');
  const commentsButton = document.querySelector('.comments-tab');
  const worklogButton = document.querySelector('.worklog-tab');

  if (tabName === 'comments') {
    commentsTab.classList.remove('hidden');
    worklogTab.classList.add('hidden');
    commentsButton.classList.add('border-indigo-600');
    worklogButton.classList.remove('border-indigo-600');
  } else {
    commentsTab.classList.add('hidden');
    worklogTab.classList.remove('hidden');
    commentsButton.classList.remove('border-indigo-600');
    worklogButton.classList.add('border-indigo-600');
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
      console.error('Update failed:', result.error);
      alert('Failed to update task field');
    }
  } catch (err) {
    console.error('Error updating task field:', err);
    alert('Error updating task field');
  }
}
