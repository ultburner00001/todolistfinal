import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: { type: String, enum: ["card", "upi"], required: true },
  details: { type: Object, default: {} },
  amount: { type: Number, required: true, default: 499 },
  status: { type: String, enum: ["initiated", "success", "failed"], default: "initiated" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);

