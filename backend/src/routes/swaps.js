import express from 'express';
import SwapRequest from '../models/SwapRequest.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/swaps
// @desc    Get user's swap requests
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, type = 'all', page = 1, limit = 20 } = req.query;

    let query = {};

    // Filter by type (sent/received/all)
    if (type === 'sent') {
      query.requester = req.userId;
    } else if (type === 'received') {
      query.provider = req.userId;
    } else {
      query.$or = [{ requester: req.userId }, { provider: req.userId }];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const swaps = await SwapRequest.find(query)
      .populate('requester', 'name avatar rating')
      .populate('provider', 'name avatar rating')
      .populate('skillOffered', 'title category')
      .populate('skillWanted', 'title category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(query);

    res.json({
      success: true,
      data: swaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get swaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swap requests.',
    });
  }
});

// @route   GET /api/swaps/:id
// @desc    Get swap request by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name avatar rating university bio')
      .populate('provider', 'name avatar rating university bio')
      .populate('skillOffered', 'title category description pricing')
      .populate('skillWanted', 'title category description pricing');

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    // Check authorization
    const isParticipant = 
      swap.requester._id.toString() === req.userId.toString() ||
      swap.provider._id.toString() === req.userId.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this swap request.',
      });
    }

    res.json({
      success: true,
      data: swap,
    });
  } catch (error) {
    console.error('Get swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swap request.',
    });
  }
});

// @route   POST /api/swaps
// @desc    Create a new swap request
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { provider, skillOffered, skillWanted, message, proposedSchedule, creditAmount } = req.body;

    // Can't swap with yourself
    if (provider === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create a swap request with yourself.',
      });
    }

    // Check for existing pending request
    const existingRequest = await SwapRequest.findOne({
      requester: req.userId,
      provider,
      status: { $in: ['pending', 'accepted', 'in_progress'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active swap request with this user.',
      });
    }

    const swap = await SwapRequest.create({
      requester: req.userId,
      provider,
      skillOffered,
      skillWanted,
      message,
      proposedSchedule,
      credits: {
        amount: creditAmount || 0,
        paidBy: creditAmount > 0 ? req.userId : null,
      },
    });

    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('requester', 'name avatar')
      .populate('provider', 'name avatar')
      .populate('skillOffered', 'title')
      .populate('skillWanted', 'title');

    // Create notification for provider
    const Notification = (await import('../models/Notification.js')).default;
    const User = (await import('../models/User.js')).default;
    const requester = await User.findById(req.userId);

    await Notification.createNotification({
      user: provider,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${requester.name} wants to swap skills with you`,
      relatedUser: req.userId,
      relatedSwap: swap._id,
      actionUrl: `/swaps/${swap._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Swap request sent successfully.',
      data: populatedSwap,
    });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating swap request.',
    });
  }
});

// @route   PUT /api/swaps/:id/accept
// @desc    Accept a swap request
// @access  Private (provider only)
router.put('/:id/accept', authenticate, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    // Only provider can accept
    if (swap.provider.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the provider can accept this request.',
      });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request cannot be accepted.',
      });
    }

    swap.status = 'accepted';
    swap.respondedAt = new Date();
    await swap.save();

    // Create notification for requester
    const Notification = (await import('../models/Notification.js')).default;
    const User = (await import('../models/User.js')).default;
    const provider = await User.findById(req.userId);

    await Notification.createNotification({
      user: swap.requester,
      type: 'swap_accepted',
      title: 'Swap Request Accepted',
      message: `${provider.name} accepted your swap request`,
      relatedUser: req.userId,
      relatedSwap: swap._id,
      actionUrl: `/swaps/${swap._id}`,
    });

    // Create conversation
    const { Conversation } = await import('../models/Message.js');
    await Conversation.create({
      participants: [swap.requester, swap.provider],
      swapRequest: swap._id,
    });

    res.json({
      success: true,
      message: 'Swap request accepted.',
      data: swap,
    });
  } catch (error) {
    console.error('Accept swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting swap request.',
    });
  }
});

// @route   PUT /api/swaps/:id/reject
// @desc    Reject a swap request
// @access  Private (provider only)
router.put('/:id/reject', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    if (swap.provider.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the provider can reject this request.',
      });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request cannot be rejected.',
      });
    }

    swap.status = 'rejected';
    swap.respondedAt = new Date();
    if (reason) {
      swap.cancellation = { reason, cancelledBy: req.userId };
    }
    await swap.save();

    // Create notification
    const Notification = (await import('../models/Notification.js')).default;
    const User = (await import('../models/User.js')).default;
    const provider = await User.findById(req.userId);

    await Notification.createNotification({
      user: swap.requester,
      type: 'swap_rejected',
      title: 'Swap Request Declined',
      message: `${provider.name} declined your swap request`,
      relatedUser: req.userId,
      relatedSwap: swap._id,
    });

    res.json({
      success: true,
      message: 'Swap request rejected.',
    });
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting swap request.',
    });
  }
});

// @route   PUT /api/swaps/:id/start
// @desc    Start a swap session
// @access  Private (participants only)
router.put('/:id/start', authenticate, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    const isParticipant =
      swap.requester.toString() === req.userId.toString() ||
      swap.provider.toString() === req.userId.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Swap must be accepted before starting.',
      });
    }

    swap.status = 'in_progress';
    swap.session.startedAt = new Date();
    await swap.save();

    res.json({
      success: true,
      message: 'Swap session started.',
      data: swap,
    });
  } catch (error) {
    console.error('Start swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting swap session.',
    });
  }
});

// @route   PUT /api/swaps/:id/complete
// @desc    Complete a swap
// @access  Private (participants only)
router.put('/:id/complete', authenticate, async (req, res) => {
  try {
    const { notes } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    const isParticipant =
      swap.requester.toString() === req.userId.toString() ||
      swap.provider.toString() === req.userId.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      });
    }

    if (swap.status !== 'in_progress' && swap.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Swap is not in progress.',
      });
    }

    swap.status = 'completed';
    swap.completedAt = new Date();
    swap.session.endedAt = new Date();
    if (notes) swap.session.notes = notes;
    await swap.save();

    // Update user stats
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(swap.requester, {
      $inc: { 'stats.totalSwaps': 1, 'stats.skillsLearned': 1 },
    });
    await User.findByIdAndUpdate(swap.provider, {
      $inc: { 'stats.totalSwaps': 1, 'stats.skillsTaught': 1 },
    });

    // Handle credit transfer
    if (swap.credits.amount > 0 && swap.credits.paidBy) {
      await User.findByIdAndUpdate(swap.credits.paidBy, {
        $inc: { credits: -swap.credits.amount },
      });
      const recipient = swap.credits.paidBy.toString() === swap.requester.toString()
        ? swap.provider
        : swap.requester;
      await User.findByIdAndUpdate(recipient, {
        $inc: { credits: swap.credits.amount },
      });
    }

    // Create notifications
    const Notification = (await import('../models/Notification.js')).default;
    const otherUser = swap.requester.toString() === req.userId.toString()
      ? swap.provider
      : swap.requester;

    await Notification.createNotification({
      user: otherUser,
      type: 'swap_completed',
      title: 'Swap Completed',
      message: 'Your skill swap has been marked as complete. Leave a review!',
      relatedSwap: swap._id,
      actionUrl: `/swaps/${swap._id}/review`,
    });

    res.json({
      success: true,
      message: 'Swap completed successfully.',
      data: swap,
    });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing swap.',
    });
  }
});

// @route   PUT /api/swaps/:id/cancel
// @desc    Cancel a swap request
// @access  Private (participants only)
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    const isParticipant =
      swap.requester.toString() === req.userId.toString() ||
      swap.provider.toString() === req.userId.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      });
    }

    if (['completed', 'cancelled', 'rejected'].includes(swap.status)) {
      return res.status(400).json({
        success: false,
        message: 'This swap cannot be cancelled.',
      });
    }

    swap.status = 'cancelled';
    swap.cancellation = {
      reason: reason || 'No reason provided',
      cancelledBy: req.userId,
      cancelledAt: new Date(),
    };
    await swap.save();

    // Notify other participant
    const Notification = (await import('../models/Notification.js')).default;
    const otherUser = swap.requester.toString() === req.userId.toString()
      ? swap.provider
      : swap.requester;

    await Notification.createNotification({
      user: otherUser,
      type: 'system',
      title: 'Swap Cancelled',
      message: 'A skill swap has been cancelled.',
      relatedSwap: swap._id,
    });

    res.json({
      success: true,
      message: 'Swap cancelled.',
    });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling swap.',
    });
  }
});

// @route   POST /api/swaps/:id/review
// @desc    Submit review for a completed swap
// @access  Private (participants only)
router.post('/:id/review', authenticate, async (req, res) => {
  try {
    const { rating, content, detailedRatings } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found.',
      });
    }

    if (swap.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed swaps.',
      });
    }

    const isRequester = swap.requester.toString() === req.userId.toString();
    const isProvider = swap.provider.toString() === req.userId.toString();

    if (!isRequester && !isProvider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      });
    }

    // Check if already reviewed
    const reviewField = isRequester ? 'requesterReview' : 'providerReview';
    if (swap[reviewField]?.rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this swap.',
      });
    }

    // Save review in swap
    swap[reviewField] = { rating, content, createdAt: new Date() };
    await swap.save();

    // Create Review document
    const Review = (await import('../models/Review.js')).default;
    const reviewee = isRequester ? swap.provider : swap.requester;

    await Review.create({
      reviewer: req.userId,
      reviewee,
      swapRequest: swap._id,
      skill: isRequester ? swap.skillWanted : swap.skillOffered,
      type: 'swap',
      rating,
      content,
      detailedRatings,
    });

    res.json({
      success: true,
      message: 'Review submitted successfully.',
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review.',
    });
  }
});

export default router;
