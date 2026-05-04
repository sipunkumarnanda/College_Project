
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },

    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },

    landmark: { type: String },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },

    // ✅ IMPORTANT: store vendor for fast queries
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional but useful snapshot
    productName: {
      type: String,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        enum: ["USD", "INR"],
      },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    items: [orderItemSchema],

    // ⭐ ADD THIS BACK
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    totalPrice: {
      amount: Number,
      currency: String,
    },

    shippingAddress: addressSchema,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;