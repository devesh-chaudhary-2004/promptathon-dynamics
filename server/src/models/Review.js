import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Who is being reviewed
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Who is giving the review
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Related swap request
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
  },
  // Related skill
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  },
  // Related course
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  // Related workshop
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
  },
  // Review type
  type: {
    type: String,
    enum: ['skill', 'course', 'workshop', 'swap', 'user'],
    required: true,
  },
  // Rating (1-5)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  // Detailed ratings
  detailedRatings: {
    communication: { type: Number, min: 1, max: 5 },
    knowledge: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    teaching: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
  },
  // Review content
  title: {
    type: String,
    maxLength: [100, 'Title cannot exceed 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    minLength: [10, 'Review must be at least 10 characters'],
    maxLength: [2000, 'Review cannot exceed 2000 characters'],
  },
  // Pros and cons
  pros: [{
    type: String,
    maxLength: 200,
  }],
  cons: [{
    type: String,
    maxLength: 200,
  }],
  // Would recommend
  wouldRecommend: {
    type: Boolean,
    default: true,
  },
  // Helpful votes
  helpfulVotes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votedAt: { type: Date, default: Date.now },
  }],
  // Response from reviewee
  response: {
    content: { type: String, maxLength: 1000 },
    respondedAt: { type: Date },
  },
  // Visibility
  isPublic: {
    type: Boolean,
    default: true,
  },
  // Moderation
  isApproved: {
    type: Boolean,
    default: true,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  flagReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
reviewSchema.index({ reviewee: 1, type: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ skill: 1 });
reviewSchema.index({ course: 1 });
reviewSchema.index({ workshop: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpfulVotes?.length || 0;
});

// Ensure virtuals are included
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

// Update related entity rating after save
reviewSchema.post('save', async function() {
  try {
    // Update user rating
    const User = mongoose.model('User');
    const reviews = await mongoose.model('Review').find({ reviewee: this.reviewee, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(this.reviewee, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    // Update skill/course/workshop rating if applicable
    if (this.skill) {
      const Skill = mongoose.model('Skill');
      const skillReviews = await mongoose.model('Review').find({ skill: this.skill, isApproved: true });
      const skillAvgRating = skillReviews.reduce((sum, r) => sum + r.rating, 0) / skillReviews.length;
      await Skill.findByIdAndUpdate(this.skill, {
        rating: Math.round(skillAvgRating * 10) / 10,
        reviewCount: skillReviews.length,
      });
    }

    if (this.course) {
      const Course = mongoose.model('Course');
      const courseReviews = await mongoose.model('Review').find({ course: this.course, isApproved: true });
      const courseAvgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
      await Course.findByIdAndUpdate(this.course, {
        rating: Math.round(courseAvgRating * 10) / 10,
        reviewCount: courseReviews.length,
      });
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
