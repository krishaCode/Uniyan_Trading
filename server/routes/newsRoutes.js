const express = require('express');
const router = express.Router();
const { getNews, getNewsById, createNews, updateNews, deleteNews, getNewsStats } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', (req, res, next) => {
  // Optionally attach user for role check
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
}, getNews);

router.get('/stats', protect, adminOnly, getNewsStats);
router.get('/:id', getNewsById);
router.post('/', protect, adminOnly, createNews);
router.put('/:id', protect, adminOnly, updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);

module.exports = router;
