import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      required: false, // not mandatory — can be optional
    },
  },
  { timestamps: true } // ✅ adds createdAt, updatedAt automatically
);

export default mongoose.model("Todo", todoSchema);
