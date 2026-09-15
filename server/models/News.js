const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'News content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Trading News', 'Course Update', 'Platform News', 'Market Analysis', 'Announcement'],
      default: 'Announcement',
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Auto-generate excerpt if not provided
newsSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  }
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('News', newsSchema);
