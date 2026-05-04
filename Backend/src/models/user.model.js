
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

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// 🔥 Store Schema
const storeSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, unique: true },
    description: String,

    contact: String,
    address: String,
    pincode: String,

    area: {
      type: String,
      enum: ["Baripada", "Bombeychok", "Bangiriposi", "Rairangpur"],
      required: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    image: String,

    // ✅ ONLY SOURCE OF TRUTH
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    addresses: [addressSchema],

    store: storeSchema,

    bankDetails: {
      accountNumber: String,
      bankName: String,
      ifsc: String,
      holderName: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);