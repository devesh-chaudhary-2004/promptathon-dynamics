import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters'],
    default: '',
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  college: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    enum: ['1', '2', '3', '4', '5', 'graduate', ''],
    default: '',
  },
  // Social links
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    behance: { type: String, default: '' },
    other: [{ type: String }],
  },
  // Skills user offers to teach (references to Skill documents)
  skillsOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  // Alternative name for skillsOffered (for compatibility)
  skillsToTeach: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  // Skills user wants to learn (just strings/names)
  skillsToLearn: [{
    type: String,
    trim: true,
  }],
  // Skills user wants to learn (references to Skill documents)
  skillsWanted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  // User stats
  stats: {
    totalSwaps: { type: Number, default: 0 },
    totalTeaching: { type: Number, default: 0 },
    totalLearning: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
  },
  // Rating
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  // Account status
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPro: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Preferences
  preferences: {
    preferredMode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'online',
    },
    availability: [{
      type: String,
      enum: ['weekday-morning', 'weekday-afternoon', 'weekday-evening', 'weekend-morning', 'weekend-afternoon', 'weekend-evening'],
    }],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      swapRequests: { type: Boolean, default: true },
    },
  },
  // Verification token
  verificationToken: String,
  verificationTokenExpires: Date,
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  // Activity tracking
  lastActive: {
    type: Date,
    default: Date.now,
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

// Virtual for initials
userSchema.virtual('initials').get(function() {
  return this.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);

export default User;
