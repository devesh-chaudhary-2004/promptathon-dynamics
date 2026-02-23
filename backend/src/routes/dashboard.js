import express from 'express';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Course from '../models/Course.js';
import SwapRequest from '../models/SwapRequest.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';
import { Conversation } from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard data for current user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user with populated skills
    const user = await User.findById(userId)
      .select('-password')
      .populate('skillsOffered', 'title category rating')
      .populate('skillsWanted', 'title category');

    // Get stats
    const [
      totalSwaps,
      pendingSwaps,
      activeSwaps,
      completedSwaps,
      totalCourses,
      unreadMessages,
      unreadNotifications,
    ] = await Promise.all([
      SwapRequest.countDocuments({
        $or: [{ requester: userId }, { provider: userId }],
      }),
      SwapRequest.countDocuments({
        $or: [{ requester: userId }, { provider: userId }],
        status: 'pending',
      }),
      SwapRequest.countDocuments({
        $or: [{ requester: userId }, { provider: userId }],
        status: { $in: ['accepted', 'in_progress'] },
      }),
      SwapRequest.countDocuments({
        $or: [{ requester: userId }, { provider: userId }],
        status: 'completed',
      }),
      Course.countDocuments({ 'enrolledStudents.user': userId }),
      Conversation.aggregate([
        { $match: { participants: userId } },
        { $unwind: '$unreadCounts' },
        { $match: { 'unreadCounts.user': userId } },
        { $group: { _id: null, total: { $sum: '$unreadCounts.count' } } },
      ]).then(result => result[0]?.total || 0),
      Notification.countDocuments({ user: userId, isRead: false }),
    ]);

    // Get recent activity
    const recentSwaps = await SwapRequest.find({
      $or: [{ requester: userId }, { provider: userId }],
    })
      .populate('requester', 'name avatar')
      .populate('provider', 'name avatar')
      .populate('skillOffered', 'title')
      .populate('skillWanted', 'title')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Get recent notifications
    const notifications = await Notification.find({ user: userId })
      .populate('relatedUser', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get enrolled courses with progress
    const enrolledCourses = await Course.find({
      'enrolledStudents.user': userId,
    })
      .populate('instructor', 'name avatar')
      .limit(5);

    const coursesWithProgress = enrolledCourses.map(course => {
      const enrollment = course.enrolledStudents.find(
        e => e.user.toString() === userId.toString()
      );
      return {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        progress: enrollment?.progress || 0,
      };
    });

    // Get skill recommendations based on user's interests
    const recommendedSkills = await Skill.find({
      user: { $ne: userId },
      isActive: true,
      category: { $in: user.interests || [] },
    })
      .populate('user', 'name avatar rating')
      .sort({ rating: -1 })
      .limit(6);

    // Get recent reviews received
    const recentReviews = await Review.find({
      reviewee: userId,
      isPublic: true,
    })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          rating: user.rating,
          totalReviews: user.totalReviews,
          isVerified: user.isVerified,
          university: user.university,
          major: user.major,
          bio: user.bio,
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
          interests: user.interests,
        },
        stats: {
          totalSwaps,
          pendingSwaps,
          activeSwaps,
          completedSwaps,
          totalCourses,
          unreadMessages,
          unreadNotifications,
          skillsTaught: user.stats?.skillsTaught || 0,
          skillsLearned: user.stats?.skillsLearned || 0,
          profileViews: user.stats?.profileViews || 0,
        },
        recentActivity: recentSwaps,
        notifications,
        enrolledCourses: coursesWithProgress,
        recommendedSkills,
        recentReviews,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data.',
    });
  }
});

// @route   GET /api/dashboard/stats
// @desc    Get detailed stats
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '30d' } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get swap stats by status
    const swapStats = await SwapRequest.aggregate([
      {
        $match: {
          $or: [{ requester: userId }, { provider: userId }],
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get swaps over time
    const swapsOverTime = await SwapRequest.aggregate([
      {
        $match: {
          $or: [{ requester: userId }, { provider: userId }],
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top categories
    const topCategories = await SwapRequest.aggregate([
      {
        $match: {
          $or: [{ requester: userId }, { provider: userId }],
          status: 'completed',
        },
      },
      {
        $lookup: {
          from: 'skills',
          localField: 'skillOffered',
          foreignField: '_id',
          as: 'skill',
        },
      },
      { $unwind: '$skill' },
      {
        $group: {
          _id: '$skill.category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Get credits history (simplified)
    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        swapStats: swapStats.reduce((acc, s) => {
          acc[s._id] = s.count;
          return acc;
        }, {}),
        swapsOverTime,
        topCategories,
        currentCredits: user.credits,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats.',
    });
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get activity feed
// @access  Private
router.get('/activity', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    // Combine different activity types
    const [swaps, reviews, notifications] = await Promise.all([
      SwapRequest.find({
        $or: [{ requester: userId }, { provider: userId }],
      })
        .populate('requester', 'name avatar')
        .populate('provider', 'name avatar')
        .populate('skillOffered', 'title')
        .sort({ updatedAt: -1 })
        .limit(20),
      Review.find({
        $or: [{ reviewer: userId }, { reviewee: userId }],
      })
        .populate('reviewer', 'name avatar')
        .populate('reviewee', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(10),
      Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

    // Combine and sort by date
    const activities = [
      ...swaps.map(s => ({
        type: 'swap',
        data: s,
        date: s.updatedAt,
      })),
      ...reviews.map(r => ({
        type: 'review',
        data: r,
        date: r.createdAt,
      })),
      ...notifications.map(n => ({
        type: 'notification',
        data: n,
        date: n.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity.',
    });
  }
});

// @route   GET /api/dashboard/notifications
// @desc    Get notifications
// @access  Private
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { user: req.userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedUser', 'name avatar')
      .populate('relatedSkill', 'title')
      .populate('relatedCourse', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.userId,
      isRead: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications.',
    });
  }
});

// @route   PUT /api/dashboard/notifications/read
// @desc    Mark notifications as read
// @access  Private
router.put('/notifications/read', authenticate, async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (notificationIds && notificationIds.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, user: req.userId },
        { isRead: true, readAt: new Date() }
      );
    } else {
      // Mark all as read
      await Notification.updateMany(
        { user: req.userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
    }

    res.json({
      success: true,
      message: 'Notifications marked as read.',
    });
  } catch (error) {
    console.error('Mark notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read.',
    });
  }
});

// @route   DELETE /api/dashboard/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/notifications/:id', authenticate, async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({
      success: true,
      message: 'Notification deleted.',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification.',
    });
  }
});

export default router;
