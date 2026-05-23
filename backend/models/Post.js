const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  description: {
    type: String,
    maxlength: [2000, "Description cannot exceed 2000 characters"]
  },
  imageUrl: {
    type: String,
    required: [true, "Image is required"]
  },
  imagePublicId: String,
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    max: [10000, "Price cannot exceed $10,000"]
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ["Art", "Photography", "Fashion", "Home Decor", "Crafts", "Digital Art", "Jewelry", "Books", "Music", "Other"]
  },
  tags: [{
    type: String,
    trim: true
  }],
  dimensions: {
    width: Number,
    height: Number,
    unit: { type: String, default: "cm" }
  },
  materials: [String],
  edition: {
    type: String,
    enum: ["Original", "Limited", "Open"],
    default: "Original"
  },
  editionSize: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }],
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotionEndDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search
postSchema.index({ title: "text", description: "text", tags: "text" });
postSchema.index({ category: 1, price: 1, createdAt: -1 });

// Virtual for like count
postSchema.virtual("likesCount").get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual("commentsCount").get(function() {
  return this.comments.length;
});

// Virtual for discounted price
postSchema.virtual("finalPrice").get(function() {
  return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price;
});

// Update timestamps on save
postSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Post", postSchema);
