import express from 'express';
import Post from '../models/Post.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const post = new Post({
      userId: req.user.userId,
      imageUrl,
      caption: caption || ''
    });

    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find({ userId: { $exists: true, $ne: null } })
      .populate('userId', 'username profilePicture')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });
    const validPosts = posts.filter(post => post.userId !== null && post.userId !== undefined);
    res.json(validPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user.userId;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate('userId', 'username profilePicture')
      .populate('likes', 'username');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

