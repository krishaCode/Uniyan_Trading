const VideoAccess = require('../models/VideoAccess');
const Video = require('../models/Video');
const User = require('../models/User');

// @desc    Grant video access to user
// @route   POST /api/video-access
// @access  Admin
const grantAccess = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    // Check if access already granted
    const existing = await VideoAccess.findOne({ user: userId, video: videoId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Access already granted' });
    }

    const access = await VideoAccess.create({ user: userId, video: videoId, grantedBy: req.user._id });
    res.status(201).json({ success: true, access });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Grant multiple videos to a user at once
// @route   POST /api/video-access/bulk
// @access  Admin
const grantBulkAccess = async (req, res) => {
  try {
    const { userId, videoIds } = req.body;
    const results = [];

    for (const videoId of videoIds) {
      try {
        const existing = await VideoAccess.findOne({ user: userId, video: videoId });
        if (!existing) {
          const access = await VideoAccess.create({ user: userId, video: videoId, grantedBy: req.user._id });
          results.push(access);
        }
      } catch (e) {
        // Skip duplicates
      }
    }

    res.status(201).json({ success: true, message: `${results.length} access records created`, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get videos a user has access to
// @route   GET /api/video-access/user/:userId
// @access  Admin
const getUserVideoAccess = async (req, res) => {
  try {
    const accessRecords = await VideoAccess.find({ user: req.params.userId }).populate('video');
    res.status(200).json({ success: true, accessRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all videos with access status for a user
// @route   GET /api/video-access/user/:userId/all
// @access  Admin
const getAllVideosWithAccessStatus = async (req, res) => {
  try {
    const allVideos = await Video.find().sort({ classNumber: 1 });
    const accessRecords = await VideoAccess.find({ user: req.params.userId });
    const accessedIds = new Set(accessRecords.map((r) => r.video.toString()));

    const videosWithStatus = allVideos.map((v) => ({
      ...v.toObject(),
      hasAccess: accessedIds.has(v._id.toString()),
    }));

    res.status(200).json({ success: true, videos: videosWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revoke video access
// @route   DELETE /api/video-access/:id
// @access  Admin
const revokeAccess = async (req, res) => {
  try {
    const access = await VideoAccess.findByIdAndDelete(req.params.id);
    if (!access) return res.status(404).json({ success: false, message: 'Access record not found' });
    res.status(200).json({ success: true, message: 'Access revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Revoke access by user+video
// @route   DELETE /api/video-access/user/:userId/video/:videoId
// @access  Admin
const revokeAccessByUserVideo = async (req, res) => {
  try {
    const access = await VideoAccess.findOneAndDelete({ user: req.params.userId, video: req.params.videoId });
    if (!access) return res.status(404).json({ success: false, message: 'Access record not found' });
    res.status(200).json({ success: true, message: 'Access revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { grantAccess, grantBulkAccess, getUserVideoAccess, getAllVideosWithAccessStatus, revokeAccess, revokeAccessByUserVideo };
