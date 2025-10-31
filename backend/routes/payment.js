// backend/routes/payment.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

/**
 * Helpers
 */
function maskCardNumber(cardNumber = "") {
  const cn = String(cardNumber).replace(/\s+/g, "");
  return cn.length >= 4 ? cn.slice(-4) : null;
}
function maskUpi(upi = "") {
  // keep first 3 chars and domain, mask the middle
  return upi ? upi.replace(/(.{3}).+(@.+)/, "$1***$2") : null;
}

/**
 * POST /api/payment/fake-pay
 * Body: { userId, method: "card"|"upi", details: {...}, amount?: number }
 * Query (optional): ?setPremium=true  -> sets isPremium: true on user
 *
 * Simulates a payment, stores Payment doc, updates user flags.
 */
router.post("/fake-pay", async (req, res) => {
  try {
    const { userId, method, details = {}, amount = 499 } = req.body;
    const setPremium = req.query.setPremium === "true"; // optional

    // Basic validation
    if (!userId || !method) {
      return res.status(400).json({ error: "userId and method are required" });
    }

    if (!["card", "upi"].includes(method)) {
      return res.status(400).json({ error: "method must be 'card' or 'upi'" });
    }

    const amtNum = Number(amount);
    if (Number.isNaN(amtNum) || amtNum <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Ensure user exists
    const user = await User.findById(userId).select("_id username");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mask and prepare details for storage
    const storedDetails = {};
    if (method === "card") {
      storedDetails.last4 = maskCardNumber(details.cardNumber || "");
      if (details.cardHolder) storedDetails.cardHolder = details.cardHolder;
      // NEVER store full card numbers in logs or DB
    } else {
      storedDetails.upiId = maskUpi(details.upiId || "");
    }

    // Create payment record (simulate immediate success)
    const payment = await Payment.create({
      userId,
      method,
      details: storedDetails,
      amount: amtNum,
      status: "success", // simulated success
    });

    // Update user: mark that they requested premium (and optionally mark premium)
    const userUpdate = { isPremiumRequested: true };
    if (setPremium) userUpdate.isPremium = true;

    await User.findByIdAndUpdate(userId, userUpdate);

    console.log(`Fake payment created: paymentId=${payment._id} user=${user.username} method=${method} amount=${amtNum}`);

    return res.status(201).json({
      ok: true,
      paymentId: payment._id,
      status: payment.status,
      message: "Fake payment recorded and user updated (isPremiumRequested).",
      userUpdated: userUpdate,
    });
  } catch (err) {
    console.error("Fake payment error:", err);
    return res.status(500).json({ error: "Server error during fake payment" });
  }
});

/**
 * GET /api/payment/user/:userId
 * Return payments for a user (most recent first)
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    return res.status(500).json({ error: "Server error while fetching payments" });
  }
});

/**
 * Optional: toggle payment status (for testing)
 * PATCH /api/payment/:id/status  body: { status: "success"|"failed" }
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["initiated", "success", "failed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid payment id" });
    }
    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    return res.json({ ok: true, payment });
  } catch (err) {
    console.error("Update payment status error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
