const Post = require("../models/Post");
const User = require("../models/User");

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, description, price, category, tags } = req.body;
    
    const post = new Post({
      title,
      description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
      price,
      category,
      tags: tags ? tags.split(",") : [],
      user: req.userId
    });
    
    await post.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { "stats.totalPosts": 1 }
    });
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    let filter = { isAvailable: true };
    
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    if (req.query.userId) {
      filter.user = req.query.userId;
    }
    
    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    
    const posts = await Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user", "username avatar");
    
    const total = await Post.countDocuments(filter);
    
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasMore: skip + posts.length < total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username avatar bio")
      .populate("comments.user", "username avatar");
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const allowedUpdates = ["title", "description", "price", "category", "isAvailable"];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    await post.deleteOne();
    
    await User.findByIdAndUpdate(req.userId, {
      $inc: { "stats.totalPosts": -1 }
    });
    
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like/Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.userId
    );
    
    if (likeIndex === -1) {
      post.likes.push({ user: req.userId, createdAt: new Date() });
      await post.save();
      res.json({ liked: true, likesCount: post.likes.length });
    } else {
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ liked: false, likesCount: post.likes.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const comment = {
      user: req.userId,
      text,
      createdAt: new Date()
    };
    
    post.comments.push(comment);
    await post.save();
    
    const populatedPost = await Post.findById(req.params.id)
      .populate("comments.user", "username avatar");
    
    res.json(populatedPost.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save/Unsave post
exports.toggleSave = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const postId = req.params.id;
    
    const saveIndex = user.savedPosts.indexOf(postId);
    
    if (saveIndex === -1) {
      user.savedPosts.push(postId);
      await user.save();
      res.json({ saved: true });
    } else {
      user.savedPosts.splice(saveIndex, 1);
      await user.save();
      res.json({ saved: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
