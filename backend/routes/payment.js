const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");

router.post("/create-checkout-session", auth, paymentController.createCheckoutSession);
router.post("/create-payment-intent", auth, paymentController.createPaymentIntent);
router.post("/confirm-order", auth, paymentController.confirmOrder);
router.get("/orders", auth, paymentController.getOrders);
router.get("/orders/:id", auth, paymentController.getOrder);
router.post("/orders/:id/cancel", auth, paymentController.cancelOrder);
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.handleWebhook);

module.exports = router;
