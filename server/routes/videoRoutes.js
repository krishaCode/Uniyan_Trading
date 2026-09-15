const express = require('express');
const router = express.Router();
const {
  getVideos, getMyVideos, getVideoById, createVideo, updateVideo, deleteVideo, getVideoStats
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, approvedOnly } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(approvedOnly);

router.get('/stats', adminOnly, getVideoStats);
router.get('/my', getMyVideos);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/', adminOnly, createVideo);
router.put('/:id', adminOnly, updateVideo);
router.delete('/:id', adminOnly, deleteVideo);

module.exports = router;
