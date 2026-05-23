const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password -email -verificationToken -resetPasswordToken")
      .populate("savedPosts", "title imageUrl price");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/follow/:userId", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);
    
    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (currentUser.following.includes(req.params.userId)) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.userId);
    } else {
      // Follow
      currentUser.following.push(req.params.userId);
      userToFollow.followers.push(req.userId);
    }
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({ 
      following: currentUser.following.includes(req.params.userId),
      followersCount: userToFollow.followers.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
