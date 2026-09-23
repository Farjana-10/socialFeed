require('dotenv').config()
const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

const mongoose = require('mongoose')
const Post = require('./src/models/Post')

const demoPosts = [
  {
    platformId: 'youtube',
    externalId: 'yt_001',
    title: 'New AI Tutorial 2026',
    content: 'Learn how to build a neural network from scratch in this comprehensive guide.',
    mediaUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    authorName: 'TechWithTim',
    category: 'video',
    isPublic: true
  },
  {
    platformId: 'youtube',
    externalId: 'yt_002',
    title: 'GPU Benchmarks 2026: RTX vs M4',
    content: 'Full benchmark comparison of latest GPUs for machine learning.',
    mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    authorName: 'LinusTechTips',
    category: 'video',
    isPublic: true
  },
  {
    platformId: 'reddit',
    externalId: 'rd_001',
    title: 'What is the most underrated ML library in 2026?',
    content: 'Community discussion about tools that deserve more attention.',
    mediaUrl: null,
    authorName: 'r/artificialintelligence',
    category: 'post',
    isPublic: true
  },
  {
    platformId: 'reddit',
    externalId: 'rd_002',
    title: 'Show HN: I built a social media aggregator',
    content: 'After 3 months of work, I finally launched. Feedback welcome!',
    mediaUrl: null,
    authorName: 'r/webdev',
    category: 'post',
    isPublic: true
  },
  {
    platformId: 'news',
    externalId: 'nw_001',
    title: 'Breakthrough in fusion energy announced',
    content: 'Researchers report net-positive fusion reaction sustained for 5 minutes.',
    mediaUrl: null,
    authorName: 'Reuters',
    category: 'news',
    isPublic: true
  },
  {
    platformId: 'news',
    externalId: 'nw_002',
    title: 'New privacy law takes effect in EU',
    content: 'Companies must comply with stricter data protection rules starting today.',
    mediaUrl: null,
    authorName: 'BBC News',
    category: 'news',
    isPublic: true
  },
  {
    platformId: 'youtube',
    externalId: 'yt_003',
    title: 'Building a REST API with Node.js',
    content: 'Step-by-step tutorial for beginners.',
    mediaUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
    authorName: 'Traversy Media',
    category: 'video',
    isPublic: true
  },
  {
    platformId: 'reddit',
    externalId: 'rd_003',
    title: 'Best practices for MongoDB schema design',
    content: 'Tips from experienced developers on structuring data.',
    mediaUrl: null,
    authorName: 'r/mongodb',
    category: 'post',
    isPublic: true
  }
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    await Post.deleteMany({ createdBy: null })
    await Post.insertMany(demoPosts)

    console.log(`Inserted ${demoPosts.length} demo posts`)
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error.message)
    process.exit(1)
  }
}

seed()