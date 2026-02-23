import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  // Requester (who wants to learn)
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Provider (who will teach)
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Skill being requested
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  // Skill offered in exchange (optional - for exchange mode)
  offeredSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  },
  // Description of skill offered in exchange (for exchange type when requester doesn't have a listed skill)
  offeredSkillDescription: {
    type: String,
    maxLength: [500, 'Offered skill description cannot exceed 500 characters'],
  },
  // Request type - exchange skills or pay money
  type: {
    type: String,
    enum: ['exchange', 'paid'],
    default: 'exchange',
  },
  // Amount to be paid (if type is paid) in currency
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Message from requester
  message: {
    type: String,
    maxLength: [1000, 'Message cannot exceed 1000 characters'],
  },
  // Proposed schedule
  proposedSchedule: [{
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
  }],
  // Accepted schedule
  confirmedSchedule: {
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed', 'in-progress'],
    default: 'pending',
  },
  // Response from provider
  responseMessage: {
    type: String,
    maxLength: [1000, 'Response cannot exceed 1000 characters'],
  },
  // Session details (after accepted)
  session: {
    meetingLink: { type: String },
    platform: { type: String },
    notes: { type: String },
    duration: { type: Number }, // actual duration in minutes
    completedAt: { type: Date },
  },
  // Reviews
  requesterReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  providerReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  // Timestamps
  respondedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ provider: 1, status: 1 });
swapRequestSchema.index({ skill: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
