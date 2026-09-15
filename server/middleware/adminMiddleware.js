const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin only' });
  }
};

const approvedOnly = (req, res, next) => {
  if (req.user && (req.user.status === 'approved' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Your account is pending approval. Please wait for administrator approval.',
    });
  }
};

module.exports = { adminOnly, approvedOnly };
