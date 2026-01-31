import express from 'express';
import Course from '../models/Course.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      isFree,
      sortBy = 'popular',
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

    // Level filter
    if (level) {
      query.level = level;
    }

    // Free courses filter
    if (isFree === 'true') {
      query['pricing.credits'] = 0;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.credits'] = query['pricing.credits'] || {};
      if (minPrice) query['pricing.credits'].$gte = parseInt(minPrice);
      if (maxPrice) query['pricing.credits'].$lte = parseInt(maxPrice);
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { 'stats.enrolledCount': -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'priceAsc':
        sort = { 'pricing.credits': 1 };
        break;
      case 'priceDesc':
        sort = { 'pricing.credits': -1 };
        break;
      default:
        sort = { 'stats.enrolledCount': -1 };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar rating university')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses.',
    });
  }
});

// @route   GET /api/courses/featured
// @desc    Get featured courses
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'name avatar rating')
      .sort({ rating: -1 })
      .limit(6);

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured courses.',
    });
  }
});

// @route   GET /api/courses/my-courses
// @desc    Get current user's enrolled courses
// @access  Private
router.get('/my-courses', authenticate, async (req, res) => {
  try {
    const courses = await Course.find({
      'enrolledStudents.user': req.userId,
    }).populate('instructor', 'name avatar rating');

    // Add progress info for each course
    const coursesWithProgress = courses.map(course => {
      const enrollment = course.enrolledStudents.find(
        e => e.user.toString() === req.userId.toString()
      );
      return {
        ...course.toObject(),
        progress: enrollment?.progress || 0,
        enrolledAt: enrollment?.enrolledAt,
      };
    });

    res.json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses.',
    });
  }
});

// @route   GET /api/courses/teaching
// @desc    Get courses created by current user
// @access  Private
router.get('/teaching', authenticate, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Get teaching courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses.',
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar rating university bio totalReviews stats');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check if user is enrolled
    let isEnrolled = false;
    let userProgress = 0;
    if (req.user) {
      const enrollment = course.enrolledStudents.find(
        e => e.user.toString() === req.userId.toString()
      );
      isEnrolled = !!enrollment;
      userProgress = enrollment?.progress || 0;
    }

    // Increment view count
    course.stats.views = (course.stats.views || 0) + 1;
    await course.save();

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        isEnrolled,
        userProgress,
        // Hide lesson content if not enrolled (only show preview)
        modules: course.modules.map(module => ({
          ...module.toObject(),
          lessons: module.lessons.map(lesson => ({
            ...lesson.toObject(),
            content: (isEnrolled || lesson.isPreview) ? lesson.content : null,
            videoUrl: (isEnrolled || lesson.isPreview) ? lesson.videoUrl : null,
          })),
        })),
      },
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course.',
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.userId,
    });

    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name avatar rating');

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: populatedCourse,
    });
  } catch (error) {
    console.error('Create course error:', error);
    
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
      message: 'Error creating course.',
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (instructor only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course.',
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('instructor', 'name avatar rating');

    res.json({
      success: true,
      message: 'Course updated successfully.',
      data: updatedCourse,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course.',
    });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      e => e.user.toString() === req.userId.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course.',
      });
    }

    // Check credits
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);

    if (course.pricing.credits > 0 && user.credits < course.pricing.credits) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits.',
      });
    }

    // Deduct credits
    if (course.pricing.credits > 0) {
      user.credits -= course.pricing.credits;
      await user.save();

      // Add credits to instructor
      await User.findByIdAndUpdate(course.instructor, {
        $inc: { credits: course.pricing.credits },
      });
    }

    // Enroll student
    course.enrolledStudents.push({
      user: req.userId,
      enrolledAt: new Date(),
      progress: 0,
    });
    course.stats.enrolledCount = (course.stats.enrolledCount || 0) + 1;
    await course.save();

    // Create notification for instructor
    const Notification = (await import('../models/Notification.js')).default;
    await Notification.createNotification({
      user: course.instructor,
      type: 'course_enrolled',
      title: 'New Enrollment',
      message: `${user.name} enrolled in your course "${course.title}"`,
      relatedUser: req.userId,
      relatedCourse: course._id,
      actionUrl: `/courses/${course._id}`,
    });

    res.json({
      success: true,
      message: 'Enrolled successfully.',
      data: { credits: user.credits },
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course.',
    });
  }
});

// @route   POST /api/courses/:id/progress
// @desc    Update course progress
// @access  Private
router.post('/:id/progress', authenticate, async (req, res) => {
  try {
    const { lessonId, moduleId, completed } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const enrollmentIndex = course.enrolledStudents.findIndex(
      e => e.user.toString() === req.userId.toString()
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course.',
      });
    }

    // Update completed lessons
    if (completed && lessonId) {
      const enrollment = course.enrolledStudents[enrollmentIndex];
      if (!enrollment.completedLessons) {
        enrollment.completedLessons = [];
      }
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }

      // Calculate progress
      const totalLessons = course.modules.reduce(
        (sum, mod) => sum + mod.lessons.length,
        0
      );
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );

      course.enrolledStudents[enrollmentIndex] = enrollment;
      await course.save();

      // Check for completion
      if (enrollment.progress === 100 && !enrollment.completedAt) {
        enrollment.completedAt = new Date();
        course.stats.completionCount = (course.stats.completionCount || 0) + 1;
        await course.save();
      }
    }

    res.json({
      success: true,
      message: 'Progress updated.',
      data: {
        progress: course.enrolledStudents[enrollmentIndex].progress,
      },
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress.',
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (instructor only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (course.instructor.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course.',
      });
    }

    // Soft delete
    course.isPublished = false;
    await course.save();

    res.json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course.',
    });
  }
});

export default router;
