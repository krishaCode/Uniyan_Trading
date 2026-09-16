const Review = require('../models/Review');

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(12);
    const stats = await Review.aggregate([
      { $match: { approved: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, total: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      reviews,
      average: stats[0]?.average || 0,
      total: stats[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id },
      { rating, comment, approved: true },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('user', 'name');

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, createReview };
