// Code generated using Cursor AI prompt
import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all chats for the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find all chats where user is a participant
    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'username profilePicture')
      .sort({ updatedAt: -1 });

    // Format response with last message and other participant info
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId
      );
      const lastMessage = chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1]
        : null;

      return {
        _id: chat._id,
        otherParticipant: {
          _id: otherParticipant._id,
          username: otherParticipant.username,
          profilePicture: otherParticipant.profilePicture
        },
        lastMessage: lastMessage ? {
          text: lastMessage.text,
          timestamp: lastMessage.timestamp,
          sender: lastMessage.sender
        } : null,
        updatedAt: chat.updatedAt
      };
    });

    res.json(formattedChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get or create a chat between two users
router.get('/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const otherUserId = req.params.otherUserId;

    if (userId === otherUserId) {
      return res.status(400).json({ error: 'Cannot chat with yourself' });
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find existing chat or create new one
    let chat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] }
    }).populate('participants', 'username profilePicture');

    if (!chat) {
      chat = new Chat({
        participants: [userId, otherUserId],
        messages: []
      });
      await chat.save();
      chat = await Chat.findById(chat._id)
        .populate('participants', 'username profilePicture');
    }

    // Format messages with sender info
    const messages = await Promise.all(
      chat.messages.map(async (msg) => {
        const sender = await User.findById(msg.sender);
        return {
          _id: msg._id || msg.sender + '-' + msg.timestamp,
          sender: {
            _id: sender._id,
            username: sender.username,
            profilePicture: sender.profilePicture
          },
          text: msg.text,
          timestamp: msg.timestamp
        };
      })
    );

    const otherParticipant = chat.participants.find(
      p => p._id.toString() !== userId
    );

    res.json({
      _id: chat._id,
      otherParticipant: {
        _id: otherParticipant._id,
        username: otherParticipant.username,
        profilePicture: otherParticipant.profilePicture
      },
      messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message
router.post('/:otherUserId/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const otherUserId = req.params.otherUserId;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    if (userId === otherUserId) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, otherUserId],
        messages: []
      });
    }

    // Add message
    const newMessage = {
      sender: userId,
      text: text.trim(),
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.updatedAt = new Date();
    await chat.save();

    // Populate sender info
    const sender = await User.findById(userId);
    const formattedMessage = {
      _id: chat.messages[chat.messages.length - 1]._id || userId + '-' + newMessage.timestamp,
      sender: {
        _id: sender._id,
        username: sender.username,
        profilePicture: sender.profilePicture
      },
      text: newMessage.text,
      timestamp: newMessage.timestamp
    };

    // Emit Socket.IO event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.emit('newMessage', {
        chatId: chat._id.toString(),
        message: formattedMessage,
        participants: chat.participants.map(p => p.toString())
      });
    }

    res.status(201).json(formattedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

