import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  // Related to a swap request (optional)
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
  },
  // Last message preview
  lastMessage: {
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date },
  },
  // Unread counts per user
  unreadCounts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 },
  }],
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxLength: [5000, 'Message cannot exceed 5000 characters'],
  },
  // Message type
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text',
  },
  // File attachment
  attachment: {
    url: { type: String },
    name: { type: String },
    type: { type: String },
    size: { type: Number },
  },
  // Read status
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date },
  }],
  // Status
  isEdited: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);

export { Conversation, Message };
