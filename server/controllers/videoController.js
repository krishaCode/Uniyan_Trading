const Video = require('../models/Video');
const VideoAccess = require('../models/VideoAccess');

// @desc    Get all videos (admin)
// @route   GET /api/videos
// @access  Admin / Approved User
const getVideos = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    // Non-admins only see published videos
    if (req.user.role !== 'admin') {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const videos = await Video.find(query).sort({ classNumber: 1 }).skip(skip).limit(Number(limit));
    const total = await Video.countDocuments(query);

    res.status(200).json({ success: true, videos, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get videos accessible by current user
// @route   GET /api/videos/my
// @access  Private (Approved user)
const getMyVideos = async (req, res) => {
  try {
    const accessRecords = await VideoAccess.find({ user: req.user._id }).populate({
      path: 'video',
      match: { status: 'published' },
    });

    const videos = accessRecords.filter((r) => r.video !== null).map((r) => r.video);
    res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Private
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    // Check access for non-admin users
    if (req.user.role !== 'admin') {
      if (video.status !== 'published') {
        return res.status(403).json({ success: false, message: 'Video not available' });
      }
      const hasAccess = await VideoAccess.findOne({ user: req.user._id, video: video._id });
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this video' });
      }
    }

    // Increment view count
    video.views += 1;
    await video.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create video
// @route   POST /api/videos
// @access  Admin
const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Admin
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    Object.assign(video, req.body);
    await video.save();

    res.status(200).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Admin
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    await VideoAccess.deleteMany({ video: req.params.id });
    res.status(200).json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get video stats for admin dashboard
// @route   GET /api/videos/stats
// @access  Admin
const getVideoStats = async (req, res) => {
  try {
    const total = await Video.countDocuments();
    const published = await Video.countDocuments({ status: 'published' });
    const draft = await Video.countDocuments({ status: 'draft' });
    res.status(200).json({ success: true, stats: { total, published, draft } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVideos, getMyVideos, getVideoById, createVideo, updateVideo, deleteVideo, getVideoStats };
