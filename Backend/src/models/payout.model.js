
import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paidAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Payout", payoutSchema);