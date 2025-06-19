const List = require('../models/List');
const Task = require('../models/Task');
const User = require('../models/User');

exports.addList = async (req, res) => {
  const { name } = req.body;
  try {
    const list = new List({
      name,
      user: req.user._id,
    });
    await list.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteList = async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure the list exists and is owned by the user
    const list = await List.findOne({
      _id: id,
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
    });
    if (!list) {
      return res.status(404).send('List not found');
    }
    if (list.isDefault) {
      return res.status(400).send('Cannot delete default list');
    }

    // If the user is the owner, reassign tasks to the default list
    if (list.user.toString() === req.user._id.toString()) {
      const defaultList = await List.findOne({
        user: req.user._id,
        isDefault: true,
      });
      if (!defaultList) {
        return res.status(400).send('No default list found');
      }
      await Task.updateMany({ list: id }, { $set: { list: defaultList._id } });
      await List.findOneAndDelete({ _id: id });
    } else {
      // If the user is not the owner, just remove them from the sharedWith array
      list.sharedWith = list.sharedWith.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      await list.save();
    }

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.setDefaultList = async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure the list exists and is owned by the user
    const list = await List.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!list) {
      return res.status(404).send('List not found');
    }

    await List.updateMany(
      { user: req.user._id, isDefault: true },
      { $set: { isDefault: false } }
    );
    list.isDefault = true;
    await list.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.unsetDefaultList = async (req, res) => {
  try {
    await List.updateMany(
      { user: req.user._id, isDefault: true },
      { $set: { isDefault: false } }
    );
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateList = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    // Ensure the list exists and is accessible by the user
    const list = await List.findOne({
      _id: id,
      $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    // Only the owner can update the list name
    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    list.name = name;
    await list.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.shareList = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    // Find the user by email
    const userToShareWith = await User.findOne({ email });
    if (!userToShareWith) {
      return res.status(404).send('User with the provided email not found');
    }

    // Find the list and ensure the current user has access to it
    const list = await List.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!list) {
      return res.status(404).send('List not found');
    }

    // Check if the user is already in the sharedWith array
    if (list.sharedWith.includes(userToShareWith._id)) {
      return res.status(400).send('List is already shared with this user');
    }

    // Add the user to the sharedWith array
    list.sharedWith.push(userToShareWith._id);
    await list.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
