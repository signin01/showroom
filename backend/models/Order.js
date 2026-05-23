const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [{
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    title: String,
    quantity: Number,
    price: Number,
    discount: Number,
    total: Number,
    imageUrl: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "USD"
  },
  stripePaymentIntentId: String,
  stripeCustomerId: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "refunded", "partially_refunded"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["card", "paypal", "apple_pay", "google_pay"],
    default: "card"
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
    default: "pending"
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
    email: String
  },
  billingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String,
  receipt_url: String,
  invoice_url: String,
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
orderSchema.pre("save", async function(next) {
  if (!this.orderNumber) {
    this.orderNumber = "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

// Virtual for status badge
orderSchema.virtual("statusBadge").get(function() {
  const statuses = {
    pending: { color: "yellow", text: "Pending" },
    confirmed: { color: "blue", text: "Confirmed" },
    processing: { color: "orange", text: "Processing" },
    shipped: { color: "purple", text: "Shipped" },
    delivered: { color: "green", text: "Delivered" },
    cancelled: { color: "red", text: "Cancelled" },
    returned: { color: "gray", text: "Returned" }
  };
  return statuses[this.orderStatus] || { color: "gray", text: this.orderStatus };
});

module.exports = mongoose.model("Order", orderSchema);
