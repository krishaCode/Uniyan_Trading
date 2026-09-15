require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Video = require('../models/Video');
const News = require('../models/News');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB for seeding');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional)
    console.log('🌱 Seeding database...');

    // Create admin if doesn't exist
    const existingAdmin = await User.findOne({ email: 'admin@tradenex.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'TradNex Admin',
        email: 'admin@tradenex.com',
        nic: 'ADMIN001',
        phone: '+1234567890',
        password: 'Admin@123',
        role: 'admin',
        status: 'approved',
      });
      console.log('✅ Admin user created: admin@tradenex.com / Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed sample news
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany([
        {
          title: 'Introduction to Technical Analysis',
          content: 'Technical analysis is a trading discipline employed to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.',
          excerpt: 'Learn the fundamentals of technical analysis for trading success.',
          category: 'Trading News',
          image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
          published: true,
          publishedAt: new Date(),
        },
        {
          title: 'New Trading Course: Advanced Candlestick Patterns',
          content: 'We are excited to announce the launch of our advanced candlestick pattern recognition course. This comprehensive program covers over 50 candlestick patterns and their practical applications.',
          excerpt: 'Master advanced candlestick patterns with our new comprehensive course.',
          category: 'Course Update',
          image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
          published: true,
          publishedAt: new Date(),
        },
        {
          title: 'Platform Update: Enhanced Video Player',
          content: 'We have upgraded our video player with new features including playback speed control, picture-in-picture mode, and improved mobile support.',
          excerpt: 'Experience our enhanced video learning platform with new features.',
          category: 'Platform News',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          published: true,
          publishedAt: new Date(),
        },
      ]);
      console.log('✅ Sample news articles created');
    }

    console.log('\n🎉 Database seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:');
    console.log('  Email:    admin@tradenex.com');
    console.log('  Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
