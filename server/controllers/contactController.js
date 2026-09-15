const Contact = require('../models/Contact');

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const contact = await Contact.create({ name, email, subject, message, user: req.user?._id || null });
    res.status(201).json({ success: true, message: 'Message sent successfully!', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
const getMessages = async (req, res) => {
  try {
    const { read, page = 1, limit = 20 } = req.query;
    const query = {};
    if (read !== undefined) query.read = read === 'true';
    const skip = (page - 1) * limit;
    const messages = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Contact.countDocuments(query);
    const unread = await Contact.countDocuments({ read: false });
    res.status(200).json({ success: true, messages, total, unread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single message
// @route   GET /api/contact/:id
// @access  Admin
const getMessageById = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Admin
const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact, getMessages, getMessageById, markAsRead, deleteMessage };
