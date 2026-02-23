import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Who receives the notification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Notification type
  type: {
    type: String,
    enum: [
      'swap_request',
      'swap_accepted',
      'swap_rejected',
      'swap_completed',
      'new_message',
      'new_review',
      'course_enrolled',
      'payment_received',
      'profile_view',
      'skill_match',
      'system',
      'achievement',
    ],
    required: true,
  },
  // Title and message
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxLength: [100, 'Title cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxLength: [500, 'Message cannot exceed 500 characters'],
  },
  // Related entities
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  relatedSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  },
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  relatedWorkshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
  },
  relatedSwap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
  },
  relatedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  // Action link
  actionUrl: {
    type: String,
  },
  actionText: {
    type: String,
  },
  // Read status
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  // Email sent
  emailSent: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
  },
  // Push notification sent
  pushSent: {
    type: Boolean,
    default: false,
  },
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  // Expiry
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create and send notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = await this.create(data);
  
  // Emit socket event if available
  if (global.io) {
    global.io.to(`user_${data.user}`).emit('notification', {
      notification: await notification.populate([
        { path: 'relatedUser', select: 'name avatar' },
        { path: 'relatedSkill', select: 'title' },
      ]),
    });
  }
  
  return notification;
};

// Mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
