import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { rateLimit } from '../middleware/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', rateLimit(60000, 10), async (req, res) => {
  try {
    // Required fields: name, email, password, city
    // Optional fields: college, year, bio, github, linkedin, portfolio, leetcode, codeforces, behance, skillsToTeach, skillsToLearn
    const { 
      name, 
      email, 
      password, 
      city,
      // Optional fields
      college,
      year,
      bio,
      github,
      linkedin,
      portfolio,
      leetcode,
      codeforces,
      behance,
      otherLinks,
      skillsToTeach,
      skillsToLearn,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !city) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and city are required.',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Build user data with required and optional fields
    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      city,
      verificationToken,
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // Add optional fields if provided
    if (college) userData.college = college;
    if (year) userData.year = year;
    if (bio) userData.bio = bio;
    if (skillsToTeach) userData.skillsToTeach = skillsToTeach;
    if (skillsToLearn) userData.skillsToLearn = skillsToLearn;
    
    // Social links
    userData.socialLinks = {
      github: github || '',
      linkedin: linkedin || '',
      portfolio: portfolio || '',
      leetcode: leetcode || '',
      codeforces: codeforces || '',
      behance: behance || '',
      other: otherLinks || [],
    };

    // Create user
    const user = await User.create(userData);

    // Generate JWT
    const token = generateToken(user._id);

    // Send verification email (non-blocking)
    sendVerificationEmail(user, verificationToken).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        isVerified: user.isVerified,
        city: user.city,
        college: user.college,
        year: user.year,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
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
      message: 'Error creating account. Please try again.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', rateLimit(60000, 10), async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user (include password field for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    user.stats.lastActive = Date.now();
    await user.save();

    // Generate JWT with extended expiry if rememberMe
    const tokenExpiry = rememberMe ? '30d' : (process.env.JWT_EXPIRE || '7d');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        isVerified: user.isVerified,
        city: user.city,
        college: user.college,
        year: user.year,
        bio: user.bio,
        socialLinks: user.socialLinks,
        rating: user.rating,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId)
      .select('-password -verificationToken -resetPasswordToken')
      .populate('skillsOffered', 'title category expertise')
      .populate('skillsWanted', 'title category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authenticated.',
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', rateLimit(60000, 5), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send password reset email (non-blocking)
    sendPasswordResetEmail(user, resetToken).catch(err => {
      console.error('Failed to send password reset email:', err);
    });

    res.json({
      success: true,
      message: 'If an account exists, a reset link has been sent.',
      // For development, include token (remove in production)
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request.',
    });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', rateLimit(60000, 5), async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash token to compare
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Generate new JWT
    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful.',
      token: jwtToken,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password.',
    });
  }
});

// @route   GET /api/auth/verify/:token
// @desc    Verify email
// @access  Public
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email.',
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Private
router.post('/resend-verification', rateLimit(60000, 3), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified.' });
    }

    // Generate new verification token
    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // TODO: Send verification email

    res.json({
      success: true,
      message: 'Verification email sent.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification email.',
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password (authenticated)
// @access  Private
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password.',
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential, profile } = req.body;

    if (!profile || !profile.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credentials.',
      });
    }

    // Find or create user
    let user = await User.findOne({ email: profile.email.toLowerCase() });

    if (!user) {
      // Create new user from Google profile
      user = await User.create({
        name: profile.name,
        email: profile.email.toLowerCase(),
        avatar: profile.picture,
        googleId: profile.sub,
        isVerified: true, // Google accounts are pre-verified
        password: crypto.randomBytes(32).toString('hex'), // Random password
      });
    } else {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = profile.sub;
        if (profile.picture && !user.avatar) {
          user.avatar = profile.picture;
        }
        await user.save();
      }
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error with Google authentication.',
    });
  }
});

export default router;
