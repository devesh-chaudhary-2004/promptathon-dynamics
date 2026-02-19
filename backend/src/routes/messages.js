import express from 'express';
import { Conversation, Message } from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const conversations = await Conversation.find({
      participants: req.userId,
      isActive: true,
    })
      .populate('participants', 'name avatar rating')
      .populate('swapRequest', 'status skillOffered skillWanted')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Conversation.countDocuments({
      participants: req.userId,
      isActive: true,
    });

    // Add unread count for current user
    const conversationsWithUnread = conversations.map(conv => {
      const unreadEntry = conv.unreadCounts?.find(
        u => u.user.toString() === req.userId.toString()
      );
      return {
        ...conv.toObject(),
        unreadCount: unreadEntry?.count || 0,
        otherParticipant: conv.participants.find(
          p => p._id.toString() !== req.userId.toString()
        ),
      };
    });

    res.json({
      success: true,
      data: conversationsWithUnread,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations.',
    });
  }
});

// @route   GET /api/messages/conversations/:id
// @desc    Get messages in a conversation
// @access  Private
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name avatar rating');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      p => p._id.toString() === req.userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation.',
      });
    }

    const messages = await Message.find({
      conversation: req.params.id,
      isDeleted: false,
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      conversation: req.params.id,
      isDeleted: false,
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.userId },
        'readBy.user': { $ne: req.userId },
      },
      {
        $push: { readBy: { user: req.userId, readAt: new Date() } },
      }
    );

    // Reset unread count
    const unreadIndex = conversation.unreadCounts?.findIndex(
      u => u.user.toString() === req.userId.toString()
    );
    if (unreadIndex >= 0) {
      conversation.unreadCounts[unreadIndex].count = 0;
      await conversation.save();
    }

    res.json({
      success: true,
      data: {
        conversation,
        messages: messages.reverse(), // Return in chronological order
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages.',
    });
  }
});

// @route   POST /api/messages/conversations
// @desc    Create or get conversation with another user
// @access  Private
router.post('/conversations', authenticate, async (req, res) => {
  try {
    const { userId, swapRequestId } = req.body;

    if (userId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself.',
      });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, userId] },
      isActive: true,
    }).populate('participants', 'name avatar');

    if (conversation) {
      return res.json({
        success: true,
        data: conversation,
        isNew: false,
      });
    }

    // Create new conversation
    conversation = await Conversation.create({
      participants: [req.userId, userId],
      swapRequest: swapRequestId,
      unreadCounts: [
        { user: req.userId, count: 0 },
        { user: userId, count: 0 },
      ],
    });

    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name avatar');

    res.status(201).json({
      success: true,
      data: conversation,
      isNew: true,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation.',
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { conversationId, content, type = 'text', attachment } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      p => p.toString() === req.userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation.',
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.userId,
      content,
      type,
      attachment,
      readBy: [{ user: req.userId, readAt: new Date() }],
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    // Update conversation
    conversation.lastMessage = {
      content: content.substring(0, 100),
      sender: req.userId,
      sentAt: new Date(),
    };

    // Increment unread for other participants
    conversation.unreadCounts = conversation.unreadCounts.map(u => {
      if (u.user.toString() !== req.userId.toString()) {
        u.count += 1;
      }
      return u;
    });

    await conversation.save();

    // Emit socket event
    if (global.io) {
      const otherParticipants = conversation.participants.filter(
        p => p.toString() !== req.userId.toString()
      );
      
      otherParticipants.forEach(participantId => {
        global.io.to(`user_${participantId}`).emit('newMessage', {
          message: populatedMessage,
          conversationId,
        });
      });
    }

    // Create notification for other participant
    const Notification = (await import('../models/Notification.js')).default;
    const otherParticipant = conversation.participants.find(
      p => p.toString() !== req.userId.toString()
    );

    const User = (await import('../models/User.js')).default;
    const sender = await User.findById(req.userId);

    await Notification.createNotification({
      user: otherParticipant,
      type: 'new_message',
      title: 'New Message',
      message: `${sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
      relatedUser: req.userId,
      relatedMessage: message._id,
      actionUrl: `/messages/${conversationId}`,
    });

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message.',
    });
  }
});

// @route   PUT /api/messages/:id
// @desc    Edit a message
// @access  Private (sender only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    if (message.sender.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this message.',
      });
    }

    // Only allow editing within 15 minutes
    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - message.createdAt > fifteenMinutes) {
      return res.status(400).json({
        success: false,
        message: 'Can only edit messages within 15 minutes of sending.',
      });
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    // Emit socket event
    if (global.io) {
      global.io.to(`conversation_${message.conversation}`).emit('messageEdited', {
        message: populatedMessage,
      });
    }

    res.json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error editing message.',
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private (sender only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }

    if (message.sender.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message.',
      });
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    // Emit socket event
    if (global.io) {
      global.io.to(`conversation_${message.conversation}`).emit('messageDeleted', {
        messageId: message._id,
      });
    }

    res.json({
      success: true,
      message: 'Message deleted.',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message.',
    });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get total unread message count
// @access  Private
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
      isActive: true,
    });

    const totalUnread = conversations.reduce((sum, conv) => {
      const unreadEntry = conv.unreadCounts?.find(
        u => u.user.toString() === req.userId.toString()
      );
      return sum + (unreadEntry?.count || 0);
    }, 0);

    res.json({
      success: true,
      data: { unreadCount: totalUnread },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count.',
    });
  }
});

// @route   POST /api/messages/mark-read/:conversationId
// @desc    Mark all messages in conversation as read
// @access  Private
router.post('/mark-read/:conversationId', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.userId },
        'readBy.user': { $ne: req.userId },
      },
      {
        $push: { readBy: { user: req.userId, readAt: new Date() } },
      }
    );

    // Reset unread count
    const unreadIndex = conversation.unreadCounts?.findIndex(
      u => u.user.toString() === req.userId.toString()
    );
    if (unreadIndex >= 0) {
      conversation.unreadCounts[unreadIndex].count = 0;
      await conversation.save();
    }

    res.json({
      success: true,
      message: 'Messages marked as read.',
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read.',
    });
  }
});

export default router;
