const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Post = require("../models/Post");
const User = require("../models/User");

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const post = await Post.findById(item.postId);
      if (!post) {
        return res.status(404).json({ error: `Product not found` });
      }
      
      const itemTotal = post.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        post: post._id,
        title: post.title,
        quantity: item.quantity,
        price: post.price,
        total: itemTotal,
        imageUrl: post.imageUrl,
        seller: post.user
      });
    }
    
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + shippingCost + tax;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      metadata: {
        userId: req.userId
      }
    });
    
    const order = new Order({
      user: req.userId,
      orderNumber: "ORD-" + Date.now(),
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
      orderStatus: "pending",
      shippingAddress
    });
    
    await order.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm order
exports.confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    order.paymentStatus = "completed";
    order.orderStatus = "confirmed";
    await order.save();
    
    res.json({ message: "Order confirmed", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.post")
      .sort("-createdAt");
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate("items.post");
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    await order.save();
    
    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { paymentStatus: "completed", orderStatus: "confirmed" }
    );
  }
  
  res.json({ received: true });
};
