import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Skill title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Development', 'Design', 'Data-Science', 'Marketing', 'Music', 'Writing', 'Business', 'Languages', 'Science', 'DSA', 'Deployment', 'AI-ML', 'AI/ML', 'Cloud', 'Other'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  // Skill owner
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Expertise level
  expertise: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  },
  // Teaching details
  teachingMode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online',
  },
  sessionDuration: {
    type: Number, // in minutes
    default: 60,
    min: 15,
    max: 180,
  },
  maxStudents: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  language: {
    type: String,
    default: 'english',
  },
  // Pricing
  isPremium: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Prerequisites
  prerequisites: [{
    type: String,
    trim: true,
  }],
  // Learning outcomes
  learningOutcomes: [{
    type: String,
    trim: true,
  }],
  // Portfolio/Projects
  projects: [{
    title: { type: String, trim: true },
    url: { type: String, trim: true },
    description: { type: String, trim: true },
  }],
  // Availability
  availability: [{
    type: String,
    enum: ['weekday-morning', 'weekday-afternoon', 'weekday-evening', 'weekend-morning', 'weekend-afternoon', 'weekend-evening'],
  }],
  // Rating
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  // Stats
  stats: {
    views: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
  },
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Featured
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index for search
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });
skillSchema.index({ category: 1, isActive: 1 });
skillSchema.index({ user: 1 });

// Virtual for reviews
skillSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'skill',
  localField: '_id',
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
