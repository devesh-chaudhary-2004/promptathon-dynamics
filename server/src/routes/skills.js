import express from 'express';
import Skill from '../models/Skill.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      category,
      expertise,
      pricingType,
      minPrice,
      maxPrice,
      university,
      sortBy = 'popular',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Expertise level filter
    if (expertise) {
      query.expertise = expertise;
    }

    // Pricing type filter
    if (pricingType) {
      query['pricing.type'] = pricingType;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.credits'] = {};
      if (minPrice) query['pricing.credits'].$gte = parseInt(minPrice);
      if (maxPrice) query['pricing.credits'].$lte = parseInt(maxPrice);
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case 'popular':
        sort = { 'stats.totalSwaps': -1, rating: -1 };
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
        sort = { 'stats.totalSwaps': -1 };
    }

    let skills = await Skill.find(query)
      .populate('user', 'name avatar rating university totalReviews')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // University filter (after populate)
    if (university) {
      skills = skills.filter(s => 
        s.user?.university?.toLowerCase().includes(university.toLowerCase())
      );
    }

    const total = await Skill.countDocuments(query);

    res.json({
      success: true,
      data: skills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skills.',
    });
  }
});

// @route   GET /api/skills/featured
// @desc    Get featured skills
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true, isFeatured: true })
      .populate('user', 'name avatar rating university')
      .sort({ rating: -1 })
      .limit(8);

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error('Get featured skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured skills.',
    });
  }
});

// @route   GET /api/skills/categories
// @desc    Get skill categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Skill.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categories.map(c => ({ name: c._id, count: c.count })),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories.',
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get skill by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'name avatar rating university bio totalReviews stats socialLinks');

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }

    // Increment view count
    skill.stats.views = (skill.stats.views || 0) + 1;
    await skill.save();

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skill.',
    });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      expertise,
      level, // Frontend sends 'level', map to 'expertise'
      tags,
      pricing,
      availability,
      requirements,
      prerequisites, // Frontend sends 'prerequisites', map to requirements
      outcomes,
      learningOutcomes, // Frontend sends 'learningOutcomes', map to outcomes
      images,
      projects,
      // Additional fields from frontend
      mode,
      teachingMode,
      duration,
      sessionDuration,
      maxStudents,
      isPremium,
      price,
      language,
      fullDescription,
      location,
      skillsWanted,
      isDraft,
    } = req.body;

    const skill = await Skill.create({
      user: req.userId,
      title,
      description: description || fullDescription,
      category,
      expertise: (expertise || level || 'intermediate').toLowerCase(), // Convert to lowercase
      tags,
      pricing,
      availability,
      prerequisites: requirements || prerequisites,
      learningOutcomes: outcomes || learningOutcomes,
      projects,
      teachingMode: (teachingMode || mode || 'online').toLowerCase(),
      sessionDuration: sessionDuration || duration || 60,
      maxStudents: maxStudents || 1,
      isPremium: isPremium || false,
      price: price || 0,
      language: language || 'english',
      isActive: !isDraft, // If isDraft is true, set isActive to false
    });

    // Update user's skillsOffered
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { skillsOffered: skill._id },
    });

    const populatedSkill = await Skill.findById(skill._id)
      .populate('user', 'name avatar rating university');

    res.status(201).json({
      success: true,
      message: 'Skill created successfully.',
      data: populatedSkill,
    });
  } catch (error) {
    console.error('Create skill error:', error);
    
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
      message: 'Error creating skill.',
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private (owner only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }

    // Check ownership
    if (skill.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill.',
      });
    }

    const allowedUpdates = [
      'title',
      'description',
      'category',
      'expertise',
      'tags',
      'pricing',
      'availability',
      'requirements',
      'outcomes',
      'images',
      'isActive',
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar rating university');

    res.json({
      success: true,
      message: 'Skill updated successfully.',
      data: updatedSkill,
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating skill.',
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }

    // Check ownership
    if (skill.user.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill.',
      });
    }

    // Soft delete
    skill.isActive = false;
    await skill.save();

    // Remove from user's skillsOffered
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(req.userId, {
      $pull: { skillsOffered: skill._id },
    });

    res.json({
      success: true,
      message: 'Skill deleted successfully.',
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting skill.',
    });
  }
});

// @route   POST /api/skills/:id/save
// @desc    Save/bookmark a skill
// @access  Private
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found.',
      });
    }

    // Add to saved skills
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    const isSaved = user.savedSkills?.includes(skill._id);
    
    if (isSaved) {
      await User.findByIdAndUpdate(req.userId, {
        $pull: { savedSkills: skill._id },
      });
    } else {
      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { savedSkills: skill._id },
      });
    }

    res.json({
      success: true,
      message: isSaved ? 'Skill removed from saved.' : 'Skill saved successfully.',
      isSaved: !isSaved,
    });
  } catch (error) {
    console.error('Save skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving skill.',
    });
  }
});

// @route   GET /api/skills/user/:userId
// @desc    Get skills by user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.params.userId, isActive: true })
      .populate('user', 'name avatar rating university')
      .sort({ createdAt: -1 });

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

export default router;
