import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Workshop title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [5000, 'Description cannot exceed 5000 characters'],
  },
  shortDescription: {
    type: String,
    maxLength: [300, 'Short description cannot exceed 300 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['development', 'design', 'data-science', 'marketing', 'music', 'writing', 'business', 'languages', 'science', 'dsa', 'ai-ml', 'cloud', 'other'],
  },
  // Host
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Co-hosts
  coHosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Schedule
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: 30,
    max: 480,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  // Workshop type
  type: {
    type: String,
    enum: ['live', 'recorded', 'hybrid'],
    default: 'live',
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online',
  },
  // Location (for offline/hybrid)
  location: {
    venue: { type: String },
    address: { type: String },
    city: { type: String },
  },
  // Online details
  meetingLink: {
    type: String,
    default: '',
  },
  platform: {
    type: String,
    enum: ['zoom', 'google-meet', 'teams', 'discord', 'other'],
    default: 'google-meet',
  },
  // Capacity
  maxParticipants: {
    type: Number,
    default: 50,
    min: 1,
    max: 1000,
  },
  // Pricing
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  // Thumbnail
  thumbnail: {
    type: String,
    default: '',
  },
  // Prerequisites
  prerequisites: [{
    type: String,
    trim: true,
  }],
  // What you'll learn
  learningOutcomes: [{
    type: String,
    trim: true,
  }],
  // Tags
  tags: [{
    type: String,
    trim: true,
  }],
  // Registered participants
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now },
    attended: { type: Boolean, default: false },
  }],
  // Rating
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  // Stats
  stats: {
    views: { type: Number, default: 0 },
    registrations: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'live', 'completed', 'cancelled'],
    default: 'draft',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  // Recording (after workshop)
  recordingUrl: {
    type: String,
    default: '',
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
workshopSchema.index({ title: 'text', description: 'text', tags: 'text' });
workshopSchema.index({ category: 1, status: 1 });
workshopSchema.index({ scheduledDate: 1 });
workshopSchema.index({ host: 1 });

// Virtual for spots left
workshopSchema.virtual('spotsLeft').get(function() {
  return this.maxParticipants - (this.participants?.length || 0);
});

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;
