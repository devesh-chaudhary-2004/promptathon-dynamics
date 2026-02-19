import express from 'express';
import Workshop from '../models/Workshop.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/workshops
// @desc    Get all workshops with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      status,
      upcoming,
      sortBy = 'date',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isPublished: true };

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Type filter (live/recorded)
    if (type) {
      query.type = type;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Upcoming workshops only
    if (upcoming === 'true') {
      query['schedule.startDate'] = { $gte: new Date() };
      query.status = 'scheduled';
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'date':
        sort = { 'schedule.startDate': 1 };
        break;
      case 'popular':
        sort = { 'stats.registeredCount': -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      default:
        sort = { 'schedule.startDate': 1 };
    }

    const workshops = await Workshop.find(query)
      .populate('host', 'name avatar rating university')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Workshop.countDocuments(query);

    res.json({
      success: true,
      data: workshops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get workshops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workshops.',
    });
  }
});

// @route   GET /api/workshops/upcoming
// @desc    Get upcoming workshops
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const workshops = await Workshop.find({
      isPublished: true,
      'schedule.startDate': { $gte: new Date() },
      status: 'scheduled',
    })
      .populate('host', 'name avatar rating')
      .sort({ 'schedule.startDate': 1 })
      .limit(6);

    res.json({
      success: true,
      data: workshops,
    });
  } catch (error) {
    console.error('Get upcoming workshops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workshops.',
    });
  }
});

// @route   GET /api/workshops/my-workshops
// @desc    Get user's registered workshops
// @access  Private
router.get('/my-workshops', authenticate, async (req, res) => {
  try {
    const workshops = await Workshop.find({
      'participants.user': req.userId,
    })
      .populate('host', 'name avatar rating')
      .sort({ 'schedule.startDate': -1 });

    res.json({
      success: true,
      data: workshops,
    });
  } catch (error) {
    console.error('Get my workshops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workshops.',
    });
  }
});

// @route   GET /api/workshops/hosting
// @desc    Get workshops hosted by current user
// @access  Private
router.get('/hosting', authenticate, async (req, res) => {
  try {
    const workshops = await Workshop.find({ host: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: workshops,
    });
  } catch (error) {
    console.error('Get hosting workshops error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workshops.',
    });
  }
});

// @route   GET /api/workshops/:id
// @desc    Get workshop by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('host', 'name avatar rating university bio totalReviews stats')
      .populate('participants.user', 'name avatar');

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    // Check if user is registered
    let isRegistered = false;
    if (req.user) {
      isRegistered = workshop.participants.some(
        p => p.user._id.toString() === req.userId.toString()
      );
    }

    // Increment view count
    workshop.stats.views = (workshop.stats.views || 0) + 1;
    await workshop.save();

    res.json({
      success: true,
      data: {
        ...workshop.toObject(),
        isRegistered,
        spotsLeft: workshop.spotsLeft,
      },
    });
  } catch (error) {
    console.error('Get workshop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workshop.',
    });
  }
});

// @route   POST /api/workshops
// @desc    Create a new workshop
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.create({
      ...req.body,
      host: req.userId,
    });

    const populatedWorkshop = await Workshop.findById(workshop._id)
      .populate('host', 'name avatar rating');

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully.',
      data: populatedWorkshop,
    });
  } catch (error) {
    console.error('Create workshop error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating workshop.',
    });
  }
});

// @route   PUT /api/workshops/:id
// @desc    Update a workshop
// @access  Private (host only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    if (workshop.host.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workshop.',
      });
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('host', 'name avatar rating');

    res.json({
      success: true,
      message: 'Workshop updated successfully.',
      data: updatedWorkshop,
    });
  } catch (error) {
    console.error('Update workshop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating workshop.',
    });
  }
});

// @route   POST /api/workshops/:id/register
// @desc    Register for a workshop
// @access  Private
router.post('/:id/register', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    // Check if already registered
    const isRegistered = workshop.participants.some(
      p => p.user.toString() === req.userId.toString()
    );

    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this workshop.',
      });
    }

    // Check capacity
    if (workshop.spotsLeft <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Workshop is full.',
      });
    }

    // Check credits
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);

    if (workshop.pricing.credits > 0 && user.credits < workshop.pricing.credits) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits.',
      });
    }

    // Deduct credits
    if (workshop.pricing.credits > 0) {
      user.credits -= workshop.pricing.credits;
      await user.save();

      // Add credits to host
      await User.findByIdAndUpdate(workshop.host, {
        $inc: { credits: workshop.pricing.credits },
      });
    }

    // Register participant
    workshop.participants.push({
      user: req.userId,
      registeredAt: new Date(),
      status: 'registered',
    });
    workshop.stats.registeredCount = (workshop.stats.registeredCount || 0) + 1;
    await workshop.save();

    // Create notification for host
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.createNotification({
      user: workshop.host,
      type: 'workshop_reminder',
      title: 'New Registration',
      message: `${user.name} registered for your workshop "${workshop.title}"`,
      relatedUser: req.userId,
      relatedWorkshop: workshop._id,
      actionUrl: `/workshops/${workshop._id}`,
    });

    res.json({
      success: true,
      message: 'Registered successfully.',
      data: { credits: user.credits },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for workshop.',
    });
  }
});

// @route   POST /api/workshops/:id/unregister
// @desc    Unregister from a workshop
// @access  Private
router.post('/:id/unregister', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    const participantIndex = workshop.participants.findIndex(
      p => p.user.toString() === req.userId.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Not registered for this workshop.',
      });
    }

    // Check if cancellation is allowed (e.g., 24 hours before)
    const hoursUntilStart = (new Date(workshop.schedule.startDate) - new Date()) / (1000 * 60 * 60);
    
    if (hoursUntilStart < 24 && workshop.type === 'live') {
      return res.status(400).json({
        success: false,
        message: 'Cannot unregister less than 24 hours before the workshop.',
      });
    }

    // Refund credits
    if (workshop.pricing.credits > 0) {
      const User = (await import('../models/User.js')).default;
      await User.findByIdAndUpdate(req.userId, {
        $inc: { credits: workshop.pricing.credits },
      });
    }

    // Remove participant
    workshop.participants.splice(participantIndex, 1);
    workshop.stats.registeredCount = Math.max(0, (workshop.stats.registeredCount || 1) - 1);
    await workshop.save();

    res.json({
      success: true,
      message: 'Unregistered successfully.',
    });
  } catch (error) {
    console.error('Unregister error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering from workshop.',
    });
  }
});

// @route   POST /api/workshops/:id/start
// @desc    Start a live workshop
// @access  Private (host only)
router.post('/:id/start', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    if (workshop.host.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this workshop.',
      });
    }

    workshop.status = 'live';
    await workshop.save();

    // Notify participants
    const Notification = (await import('../models/Notification.js')).default;
    for (const participant of workshop.participants) {
      await Notification.createNotification({
        user: participant.user,
        type: 'workshop_starting',
        title: 'Workshop Starting',
        message: `"${workshop.title}" is starting now!`,
        relatedWorkshop: workshop._id,
        actionUrl: workshop.meetingLink || `/workshops/${workshop._id}`,
        priority: 'high',
      });
    }

    res.json({
      success: true,
      message: 'Workshop started.',
      data: { meetingLink: workshop.meetingLink },
    });
  } catch (error) {
    console.error('Start workshop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting workshop.',
    });
  }
});

// @route   POST /api/workshops/:id/end
// @desc    End a live workshop
// @access  Private (host only)
router.post('/:id/end', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    if (workshop.host.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to end this workshop.',
      });
    }

    workshop.status = 'completed';
    await workshop.save();

    res.json({
      success: true,
      message: 'Workshop ended.',
    });
  } catch (error) {
    console.error('End workshop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending workshop.',
    });
  }
});

// @route   DELETE /api/workshops/:id
// @desc    Cancel/delete a workshop
// @access  Private (host only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found.',
      });
    }

    if (workshop.host.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workshop.',
      });
    }

    // Refund all participants
    if (workshop.pricing.credits > 0) {
      const User = (await import('../models/User.js')).default;
      for (const participant of workshop.participants) {
        await User.findByIdAndUpdate(participant.user, {
          $inc: { credits: workshop.pricing.credits },
        });
      }
    }

    // Mark as cancelled
    workshop.status = 'cancelled';
    workshop.isPublished = false;
    await workshop.save();

    // Notify participants
    const Notification = (await import('../models/Notification.js')).default;
    for (const participant of workshop.participants) {
      await Notification.createNotification({
        user: participant.user,
        type: 'system',
        title: 'Workshop Cancelled',
        message: `"${workshop.title}" has been cancelled. Credits have been refunded.`,
        relatedWorkshop: workshop._id,
      });
    }

    res.json({
      success: true,
      message: 'Workshop cancelled and participants refunded.',
    });
  } catch (error) {
    console.error('Delete workshop error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling workshop.',
    });
  }
});

export default router;
