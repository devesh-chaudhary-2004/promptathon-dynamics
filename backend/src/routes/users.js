import express from 'express';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Review from '../models/Review.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (with filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      search, 
      university, 
      skills, 
      page = 1, 
      limit = 20,
      sortBy = 'rating',
    } = req.query;

    const query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } },
      ];
    }

    // University filter
    if (university) {
      query.university = { $regex: university, $options: 'i' };
    }

    // Skills filter
    if (skills) {
      const skillIds = skills.split(',');
      query.skillsOffered = { $in: skillIds };
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'mostSwaps':
        sort = { 'stats.totalSwaps': -1 };
        break;
      default:
        sort = { rating: -1 };
    }

    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .populate('skillsOffered', 'title category expertise')
      .populate('skillsWanted', 'title category')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users.',
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -resetPasswordToken')
      .populate('skillsOffered', 'title category expertise description pricing')
      .populate('skillsWanted', 'title category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Track profile view (if viewing another user's profile)
    if (req.user && req.user._id.toString() !== user._id.toString()) {
      user.stats.profileViews = (user.stats.profileViews || 0) + 1;
      await user.save();
    }

    // Get user reviews
    const reviews = await Review.find({ reviewee: user._id, isPublic: true })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        reviews,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user.',
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'bio',
      'avatar',
      'university',
      'major',
      'graduationYear',
      'interests',
      'socialLinks',
      'preferences',
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -verificationToken -resetPasswordToken');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile.',
    });
  }
});

// @route   PUT /api/users/avatar
// @desc    Update user avatar
// @access  Private
router.put('/avatar', authenticate, async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Avatar updated successfully.',
      data: { avatar: user.avatar },
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating avatar.',
    });
  }
});

// @route   GET /api/users/:id/skills
// @desc    Get user's skills
// @access  Public
router.get('/:id/skills', async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.params.id, isActive: true })
      .populate('user', 'name avatar rating');

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills.',
    });
  }
});

// @route   GET /api/users/:id/reviews
// @desc    Get user's reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ reviewee: req.params.id, isPublic: true })
      .populate('reviewer', 'name avatar')
      .populate('skill', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewee: req.params.id, isPublic: true });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews.',
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', authenticate, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully.',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating account.',
    });
  }
});

export default router;
