const express = require('express');
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { approvedOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, approvedOnly, createReview);

module.exports = router;
