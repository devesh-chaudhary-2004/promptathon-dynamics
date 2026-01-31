import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Store online users
const onlineUsers = new Map();

export const setupSocketHandlers = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (error) {
      console.error('Socket auth error:', error.message);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);
    
    // Join user's personal room
    socket.join(`user_${socket.userId}`);
    
    // Track online status
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      user: {
        id: socket.userId,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
      connectedAt: new Date(),
    });

    // Broadcast online status
    io.emit('userOnline', {
      userId: socket.userId,
      user: {
        id: socket.userId,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
    });

    // Join conversation rooms
    socket.on('joinConversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`${socket.user.name} joined conversation ${conversationId}`);
    });

    socket.on('leaveConversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`${socket.user.name} left conversation ${conversationId}`);
    });

    // Typing indicators
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation_${conversationId}`).emit('userTyping', {
        conversationId,
        userId: socket.userId,
        user: {
          id: socket.userId,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        isTyping,
      });
    });

    // Read receipts
    socket.on('markAsRead', async ({ conversationId, messageIds }) => {
      socket.to(`conversation_${conversationId}`).emit('messagesRead', {
        conversationId,
        messageIds,
        readBy: socket.userId,
        readAt: new Date(),
      });
    });

    // Get online users
    socket.on('getOnlineUsers', (callback) => {
      const users = Array.from(onlineUsers.values()).map(u => u.user);
      if (typeof callback === 'function') {
        callback(users);
      }
    });

    // Check if specific user is online
    socket.on('isUserOnline', (userId, callback) => {
      const isOnline = onlineUsers.has(userId);
      if (typeof callback === 'function') {
        callback(isOnline);
      }
    });

    // Workshop live events
    socket.on('joinWorkshop', (workshopId) => {
      socket.join(`workshop_${workshopId}`);
      socket.to(`workshop_${workshopId}`).emit('participantJoined', {
        user: {
          id: socket.userId,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
      });
    });

    socket.on('leaveWorkshop', (workshopId) => {
      socket.to(`workshop_${workshopId}`).emit('participantLeft', {
        userId: socket.userId,
      });
      socket.leave(`workshop_${workshopId}`);
    });

    socket.on('workshopMessage', ({ workshopId, message }) => {
      io.to(`workshop_${workshopId}`).emit('workshopChat', {
        user: {
          id: socket.userId,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        message,
        timestamp: new Date(),
      });
    });

    // Swap session events
    socket.on('joinSwapSession', (swapId) => {
      socket.join(`swap_${swapId}`);
      socket.to(`swap_${swapId}`).emit('swapParticipantJoined', {
        user: {
          id: socket.userId,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
      });
    });

    socket.on('leaveSwapSession', (swapId) => {
      socket.to(`swap_${swapId}`).emit('swapParticipantLeft', {
        userId: socket.userId,
      });
      socket.leave(`swap_${swapId}`);
    });

    // Video call signaling (WebRTC)
    socket.on('callUser', ({ to, signalData, from }) => {
      io.to(`user_${to}`).emit('incomingCall', {
        signal: signalData,
        from: {
          id: socket.userId,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
      });
    });

    socket.on('answerCall', ({ to, signalData }) => {
      io.to(`user_${to}`).emit('callAccepted', {
        signal: signalData,
        from: socket.userId,
      });
    });

    socket.on('rejectCall', ({ to }) => {
      io.to(`user_${to}`).emit('callRejected', {
        from: socket.userId,
      });
    });

    socket.on('endCall', ({ to }) => {
      io.to(`user_${to}`).emit('callEnded', {
        from: socket.userId,
      });
    });

    // ICE candidate exchange
    socket.on('iceCandidate', ({ to, candidate }) => {
      io.to(`user_${to}`).emit('iceCandidate', {
        candidate,
        from: socket.userId,
      });
    });

    // Screen sharing
    socket.on('startScreenShare', ({ roomId }) => {
      socket.to(roomId).emit('userStartedScreenShare', {
        userId: socket.userId,
      });
    });

    socket.on('stopScreenShare', ({ roomId }) => {
      socket.to(roomId).emit('userStoppedScreenShare', {
        userId: socket.userId,
      });
    });

    // Presence updates
    socket.on('updatePresence', (status) => {
      const userData = onlineUsers.get(socket.userId);
      if (userData) {
        userData.status = status;
        onlineUsers.set(socket.userId, userData);
        
        io.emit('presenceUpdate', {
          userId: socket.userId,
          status,
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      
      // Remove from online users
      onlineUsers.delete(socket.userId);
      
      // Broadcast offline status
      io.emit('userOffline', {
        userId: socket.userId,
      });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Utility function to send notification to user
  global.sendNotification = (userId, notification) => {
    io.to(`user_${userId}`).emit('notification', notification);
  };

  // Utility function to send message to conversation
  global.sendToConversation = (conversationId, event, data) => {
    io.to(`conversation_${conversationId}`).emit(event, data);
  };

  return io;
};

export default setupSocketHandlers;
