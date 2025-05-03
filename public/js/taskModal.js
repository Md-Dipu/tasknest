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
  document.getElementById('taskModal').classList.remove('hidden');
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
    div.textContent = `${log.duration} minutes (${new Date(
      log.createdAt
    ).toLocaleString()})`;
    worklogContainer.appendChild(div);
  });

  // Set form action
  document.getElementById('taskForm').action = `/tasks/update/${id}`;
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.add('hidden');
}

function addSubtask(
  title = '',
  description = '',
  status = 'pending',
  index = null
) {
  const subtasksContainer = document.getElementById('subtasksContainer');
  const subtaskDiv = document.createElement('div');
  subtaskDiv.className = 'space-y-2 border p-2 rounded-md';
  subtaskDiv.innerHTML = `
    <input type="text" name="subtasks[title][]" value="${title}" placeholder="Subtask Title" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600">
    <textarea name="subtasks[description][]" placeholder="Subtask Description" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600">${description}</textarea>
    <select name="subtasks[status][]" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600">
      <option value="pending" ${
        status === 'pending' ? 'selected' : ''
      }>Pending</option>
      <option value="done" ${status === 'done' ? 'selected' : ''}>Done</option>
    </select>
    <button type="button" onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700">Remove</button>
  `;
  subtasksContainer.appendChild(subtaskDiv);
}
