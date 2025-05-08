const Task = require('../models/Task');
const List = require('../models/List');

const themes = {
  student: {
    primary: 'bg-indigo-600',
    primaryHover: 'bg-indigo-700',
    accent: 'text-indigo-600',
    accentHover: 'text-indigo-800',
    focusRing: 'focus:ring-indigo-500',
    tabHover: 'border-indigo-500',
  },
  professional: {
    primary: 'bg-teal-600',
    primaryHover: 'bg-teal-700',
    accent: 'text-teal-600',
    accentHover: 'text-teal-800',
    focusRing: 'focus:ring-teal-500',
    tabHover: 'border-teal-500',
  },
  religious: {
    primary: 'bg-purple-600',
    primaryHover: 'bg-purple-700',
    accent: 'text-purple-600',
    accentHover: 'text-purple-800',
    focusRing: 'focus:ring-purple-500',
    tabHover: 'border-purple-500',
  },
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    const lists = await List.find({ user: req.user._id });
    const userType = req.user.userType || 'student';
    res.render(`dashboard/${userType}`, {
      user: req.user,
      tasks,
      lists,
      userType,
      theme: themes[userType],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.addTask = async (req, res) => {
  const { title, listId } = req.body;
  try {
    let list = listId
      ? await List.findOne({ _id: listId, user: req.user._id })
      : null;
    if (!list) {
      list = await List.findOne({ user: req.user._id, isDefault: true });
      if (!list) {
        list = new List({
          name: 'Default',
          isDefault: true,
          user: req.user._id,
        });
        await list.save();
      }
    }
    const task = new Task({
      title,
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
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (status) updateData.status = status;
    if (listId) updateData.list = listId;

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
      { _id: id, user: req.user._id },
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

exports.updateTaskField = async (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;
  try {
    const updateData = {};
    if (field === 'dueDate') {
      updateData[field] = value ? new Date(value) : null;
    } else if (['priority', 'status', 'list'].includes(field)) {
      updateData[field] = value;
    } else {
      return res.status(400).json({ error: 'Invalid field' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findOneAndDelete({ _id: id, user: req.user._id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateTaskTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { title } },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
