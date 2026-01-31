import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email helper
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'SkillX'}" <${process.env.SMTP_USER || process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  // Verification email
  verification: (name, verificationUrl) => ({
    subject: 'Verify your SkillX account',
    text: `Hi ${name},\n\nWelcome to SkillX! Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link expires in 24 hours.\n\nIf you didn't create this account, please ignore this email.\n\nBest,\nThe SkillX Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .button:hover { background: #0d9488; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 SkillX</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Thanks for joining SkillX - the student skill exchange platform. To get started, please verify your email address.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px; font-size: 12px;">${verificationUrl}</p>
            <p><strong>This link expires in 24 hours.</strong></p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} SkillX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Password reset email
  passwordReset: (name, resetUrl) => ({
    subject: 'Reset your SkillX password',
    text: `Hi ${name},\n\nYou requested to reset your password. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email. Your password won't change.\n\nBest,\nThe SkillX Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>You requested to reset your password. Click the button below to set a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 5px; font-size: 12px;">${resetUrl}</p>
            <p><strong>This link expires in 1 hour.</strong></p>
            <p>If you didn't request this password reset, you can safely ignore this email. Your password won't be changed.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} SkillX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Swap request notification
  swapRequest: (recipientName, requesterName, skillOffered, skillWanted, swapUrl) => ({
    subject: `New skill swap request from ${requesterName}`,
    text: `Hi ${recipientName},\n\n${requesterName} wants to swap skills with you!\n\nThey're offering: ${skillOffered}\nThey want to learn: ${skillWanted}\n\nView and respond to this request: ${swapUrl}\n\nBest,\nThe SkillX Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .skill-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; }
          .button { display: inline-block; background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 New Swap Request!</h1>
          </div>
          <div class="content">
            <h2>Hi ${recipientName},</h2>
            <p><strong>${requesterName}</strong> wants to swap skills with you!</p>
            <div class="skill-box">
              <p><strong>📚 They're offering:</strong> ${skillOffered}</p>
              <p><strong>🎯 They want to learn:</strong> ${skillWanted}</p>
            </div>
            <p style="text-align: center;">
              <a href="${swapUrl}" class="button">View Request</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} SkillX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // New message notification
  newMessage: (recipientName, senderName, messagePreview, chatUrl) => ({
    subject: `New message from ${senderName}`,
    text: `Hi ${recipientName},\n\nYou have a new message from ${senderName}:\n\n"${messagePreview}"\n\nReply here: ${chatUrl}\n\nBest,\nThe SkillX Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; border-left: 4px solid #14b8a6; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
          .button { display: inline-block; background: #14b8a6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 New Message</h1>
          </div>
          <div class="content">
            <h2>Hi ${recipientName},</h2>
            <p>You have a new message from <strong>${senderName}</strong>:</p>
            <div class="message-box">
              <p>"${messagePreview}"</p>
            </div>
            <p style="text-align: center;">
              <a href="${chatUrl}" class="button">Reply Now</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} SkillX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Convenience methods
export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const template = emailTemplates.verification(user.name, verificationUrl);
  return sendEmail({
    to: user.email,
    ...template,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const template = emailTemplates.passwordReset(user.name, resetUrl);
  return sendEmail({
    to: user.email,
    ...template,
  });
};

export const sendSwapRequestEmail = async (recipient, requester, skillOffered, skillWanted, swapId) => {
  const swapUrl = `${process.env.CLIENT_URL}/swaps/${swapId}`;
  const template = emailTemplates.swapRequest(recipient.name, requester.name, skillOffered, skillWanted, swapUrl);
  return sendEmail({
    to: recipient.email,
    ...template,
  });
};

export const sendNewMessageEmail = async (recipient, sender, messagePreview, conversationId) => {
  const chatUrl = `${process.env.CLIENT_URL}/messages/${conversationId}`;
  const template = emailTemplates.newMessage(recipient.name, sender.name, messagePreview, chatUrl);
  return sendEmail({
    to: recipient.email,
    ...template,
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendSwapRequestEmail,
  sendNewMessageEmail,
  emailTemplates,
};
