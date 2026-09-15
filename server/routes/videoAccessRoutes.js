const express = require('express');
const router = express.Router();
const {
  grantAccess, grantBulkAccess, getUserVideoAccess,
  getAllVideosWithAccessStatus, revokeAccess, revokeAccessByUserVideo
} = require('../controllers/videoAccessController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.post('/', grantAccess);
router.post('/bulk', grantBulkAccess);
router.get('/user/:userId', getUserVideoAccess);
router.get('/user/:userId/all', getAllVideosWithAccessStatus);
router.delete('/:id', revokeAccess);
router.delete('/user/:userId/video/:videoId', revokeAccessByUserVideo);

module.exports = router;
