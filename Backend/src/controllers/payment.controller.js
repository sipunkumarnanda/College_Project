
import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";

// 🔹 Check env
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys missing in .env");
}

// 🔹 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ======================================================
// 💳 CREATE RAZORPAY ORDER (FINAL)
// ======================================================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 🔹 Validate
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Valid orderId required" });
    }

    // 🔹 Get order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔹 Auth check
    if (!req.user || !order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔹 Already paid
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const amountInPaise = Math.round(order.totalPrice.amount * 100);

    if (!amountInPaise || amountInPaise < 1) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // 🔥 PREVENT DUPLICATE
    if (order.razorpayOrderId) {
      console.log("Returning existing Razorpay order");

      return res.status(200).json({
        success: true,
        data: {
          razorpayOrderId: order.razorpayOrderId,
          keyId: process.env.RAZORPAY_KEY_ID,
          amount: amountInPaise,
        },
      });
    }

    // 🔹 Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    // Save immediately
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    console.log("Created Razorpay order:", razorpayOrder.id);

    // 🔹 Create Payment record only once
    const existingPayment = await Payment.findOne({ orderId });

    if (!existingPayment) {
      await Payment.create({
        orderId: order._id,
        user: req.user._id,
        razorpayOrderId: razorpayOrder.id,
        status: "PENDING",
        price: {
          amount: order.totalPrice.amount,
          currency: order.totalPrice.currency,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
      },
    });

  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


// ======================================================
// ✅ VERIFY PAYMENT
// ======================================================

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // 🔐 Signature verify
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // ❌ Invalid signature
    if (generatedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "FAILED",
      });

      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "FAILED" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ✅ Success
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "PAID",
    });

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "COMPLETED",
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      }
    );

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Verification failed",
    });
  }
};