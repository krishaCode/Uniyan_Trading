const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    classNumber: {
      type: Number,
      required: [true, 'Class number is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    youtubeUrl: {
      type: String,
      required: [true, 'YouTube URL is required'],
    },
    embedUrl: {
      type: String,
    },
    videoId: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    classDate: {
      type: Date,
    },
    startTime: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      default: 'TradNex Instructor',
    },
    status: {
      type: String,
      enum: ['published', 'unpublished', 'draft'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Extract YouTube video ID and generate embed URL before saving
videoSchema.pre('save', function (next) {
  if (this.youtubeUrl) {
    const urlPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const pattern of urlPatterns) {
      const match = this.youtubeUrl.match(pattern);
      if (match) {
        this.videoId = match[1];
        this.embedUrl = `https://www.youtube.com/embed/${match[1]}`;
        this.thumbnail = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        break;
      }
    }
  }
  next();
});

module.exports = mongoose.model('Video', videoSchema);
