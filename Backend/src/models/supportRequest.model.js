
import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "complaint"],
      required: true,
    },
    message: {
      type: String,
      default: "",
    },

    // ✅ NEW (safe)
    source: {
      type: String,
      enum: ["user", "vendor"],
      default: "user", // 👈 keeps old behavior intact
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("SupportRequest", supportRequestSchema);