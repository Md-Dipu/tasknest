const List = require('../models/List');
const Task = require('../models/Task');

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
    const list = await List.findOne({ _id: id, user: req.user._id });
    if (!list) {
      return res.status(404).send('List not found');
    }
    if (list.isDefault) {
      return res.status(400).send('Cannot delete default list');
    }
    const defaultList = await List.findOne({
      user: req.user._id,
      isDefault: true,
    });
    if (!defaultList) {
      return res.status(400).send('No default list found');
    }
    await Task.updateMany(
      { list: id, user: req.user._id },
      { $set: { list: defaultList._id } }
    );
    await List.findOneAndDelete({ _id: id, user: req.user._id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.setDefaultList = async (req, res) => {
  const { id } = req.params;
  try {
    await List.updateMany(
      { user: req.user._id, isDefault: true },
      { $set: { isDefault: false } }
    );
    await List.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { isDefault: true } },
      { runValidators: true }
    );
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
    const list = await List.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { name } },
      { new: true, runValidators: true }
    );
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
