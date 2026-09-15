const express = require('express');
const router = express.Router();
const { submitContact, getMessages, getMessageById, markAsRead, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public: submit contact (optionally attach user if logged in)
router.post('/', (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.id).then((user) => {
        req.user = user;
        next();
      });
    } catch {
      next();
    }
  } else {
    next();
  }
}, submitContact);

// Admin routes
router.use(protect, adminOnly);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;
