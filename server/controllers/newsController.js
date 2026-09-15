const News = require('../models/News');

// @desc    Get all news (public: published only, admin: all)
// @route   GET /api/news
// @access  Public / Admin
const getNews = async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (!req.user || req.user.role !== 'admin') {
      query.published = true;
    }
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const news = await News.find(query)
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await News.countDocuments(query);
    res.status(200).json({ success: true, news, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
  try {
    const article = await News.findById(req.params.id).populate('author', 'name');
    if (!article) return res.status(404).json({ success: false, message: 'News article not found' });
    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create news
// @route   POST /api/news
// @access  Admin
const createNews = async (req, res) => {
  try {
    const article = await News.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Admin
const updateNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    Object.assign(article, req.body);
    await article.save();
    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Admin
const deleteNews = async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get news stats
// @route   GET /api/news/stats
// @access  Admin
const getNewsStats = async (req, res) => {
  try {
    const total = await News.countDocuments();
    const published = await News.countDocuments({ published: true });
    res.status(200).json({ success: true, stats: { total, published, drafts: total - published } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNews, getNewsById, createNews, updateNews, deleteNews, getNewsStats };
