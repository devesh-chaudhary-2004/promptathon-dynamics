import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
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
  // Instructor
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Course content
  modules: [{
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number }, // in minutes
    lessons: [{
      title: { type: String, required: true },
      type: { type: String, enum: ['video', 'article', 'quiz', 'assignment'], default: 'video' },
      duration: { type: Number },
      content: { type: String },
      isPreview: { type: Boolean, default: false },
    }],
  }],
  // Course details
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
    default: 'all-levels',
  },
  language: {
    type: String,
    default: 'english',
  },
  totalDuration: {
    type: Number, // total minutes
    default: 0,
  },
  totalLessons: {
    type: Number,
    default: 0,
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
  // Enrolled students
  enrolledStudents: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: String }],
  }],
  // Rating
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  // Stats
  stats: {
    views: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
  },
  // Status
  isPublished: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
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
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ instructor: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;
