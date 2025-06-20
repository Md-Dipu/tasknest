const Task = require('../models/Task');
const List = require('../models/List');

// Fetch tasks for the dashboard
exports.getTasks = async (req, res) => {
  try {
    // Fetch lists owned by or shared with the user
    const lists = await List.find({
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
    });

    // Fetch tasks belonging to these lists
    const tasks = await Task.find({
      list: { $in: lists.map((list) => list._id) },
    });

    const userType = req.user.userType || 'student';
    res.render(`dashboard/${userType}`, {
      user: req.user,
      tasks,
      lists,
      userType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Add a new task
exports.addTask = async (req, res) => {
  const { title, listId, description, priority, dueDate } = req.body;
  try {
    // Ensure the list exists and is accessible by the user
    const list = await List.findOne({
      _id: listId,
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
    });

    if (!list) {
      return res.status(404).send('List not found or access denied');
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      list: list._id,
      user: req.user._id,
    });
    await task.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    priority,
    dueDate,
    status,
    listId,
    subtasks,
    comment,
    worklog,
    worklogDescription,
  } = req.body;

  try {
    // Find the task and populate list.user and list.sharedWith
    const task = await Task.findOne({ _id: id }).populate({
      path: 'list',
      select: 'user sharedWith',
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Check access
    const isTaskOwner = task.user.toString() === req.user._id.toString();
    const isListOwner = task.list.user.toString() === req.user._id.toString();
    const isSharedWithUser = task.list.sharedWith.some(
      (sharedUserId) => sharedUserId.toString() === req.user._id.toString()
    );

    if (!isTaskOwner && !isListOwner && !isSharedWithUser) {
      return res.status(403).send('Access denied');
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (status) updateData.status = status;

    // Ensure the new list exists and is accessible by the user
    if (listId) {
      const list = await List.findOne({
        _id: listId,
        $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
      });
      if (!list) {
        return res.status(404).send('List not found or access denied');
      }
      updateData.list = list._id;
    }

    // Handle subtasks
    if (subtasks) {
      const subtaskArray = Array.isArray(subtasks.title)
        ? subtasks.title
        : [subtasks.title];
      const subtaskUpdates = subtaskArray.map((title, index) => ({
        title,
        description: Array.isArray(subtasks.description)
          ? subtasks.description[index]
          : subtasks.description || '',
        status: Array.isArray(subtasks.status)
          ? subtasks.status[index]
          : subtasks.status || 'pending',
      }));
      updateData.subtasks = subtaskUpdates.filter((st) => st.title);
    }

    // Prepare push operations for comments and worklog
    const pushData = {};
    if (comment) {
      pushData.comments = { text: comment };
    }
    if (worklog) {
      pushData.worklog = {
        duration: parseInt(worklog, 10),
        description: worklogDescription || '',
      };
    }

    await Task.findOneAndUpdate(
      { _id: id },
      {
        $set: updateData,
        $push: pushData,
      },
      { new: true, runValidators: true }
    );
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id }).populate({
      path: 'list',
      select: 'user sharedWith',
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Check access
    const isTaskOwner = task.user.toString() === req.user._id.toString();
    const isListOwner = task.list.user.toString() === req.user._id.toString();
    const isSharedWithUser = task.list.sharedWith.some(
      (sharedUserId) => sharedUserId.toString() === req.user._id.toString()
    );

    if (!isTaskOwner && !isListOwner && !isSharedWithUser) {
      return res.status(403).send('Access denied');
    }

    await Task.findOneAndDelete({ _id: id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update a specific task field
exports.updateTaskField = async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;

  try {
    const task = await Task.findOne({ _id: id }).populate({
      path: 'list',
      select: 'user sharedWith',
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    const isTaskOwner = task.user.toString() === req.user._id.toString();
    const isListOwner = task.list.user.toString() === req.user._id.toString();
    const isSharedWithUser = task.list.sharedWith.some(
      (sharedUserId) => sharedUserId.toString() === req.user._id.toString()
    );

    if (!isTaskOwner && !isListOwner && !isSharedWithUser) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (field === 'dueDate') {
      updateData[field] = value ? new Date(value) : null;
    } else if (['priority', 'status', 'list'].includes(field)) {
      updateData[field] = value;
    } else {
      return res.status(400).json({ error: 'Invalid field' });
    }

    await Task.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update task title
exports.updateTaskTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const task = await Task.findOne({ _id: id }).populate({
      path: 'list',
      select: 'user sharedWith',
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    const isTaskOwner = task.user.toString() === req.user._id.toString();
    const isListOwner = task.list.user.toString() === req.user._id.toString();
    const isSharedWithUser = task.list.sharedWith.some(
      (sharedUserId) => sharedUserId.toString() === req.user._id.toString()
    );

    if (!isTaskOwner && !isListOwner && !isSharedWithUser) {
      return res.status(403).json({ error: 'Access denied' });
    }

    task.title = title;
    await task.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
