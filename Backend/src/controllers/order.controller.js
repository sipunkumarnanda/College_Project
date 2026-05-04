
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import Review from "../models/review.model.js";
// =======================
// PLACE ORDER
// =======================
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // 📦 Validate address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zip ||
      !shippingAddress.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // 🛒 Get cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price stock vendor"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 🔁 Prepare items
    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      if (!product.vendor) {
        return res.status(400).json({
          success: false,
          message: `Vendor missing for ${product.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        vendor: product.vendor,
        productName: product.name,
        quantity: item.quantity,
        price: {
          amount: product.price,
          currency: "INR",
        },
      });
    }

    // 🔒 Safe stock update
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        }
      );

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Stock changed, try again",
        });
      }
    }

    // 🧾 Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice: {
        amount: totalAmount,
        currency: "INR",
      },
      shippingAddress,
      paymentStatus: "PENDING", // ✅ IMPORTANT
    });

    // 🧹 Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created",
      data: order,
    });

  } catch (error) {
    console.error("Order error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// =======================
// GET MY ORDERS
// =======================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name image")
      .sort("-createdAt");

    // ⭐ attach reviews
    const reviews = await Review.find({ user: req.user.id });

    const ordersWithReviews = orders.map(order => {
      const orderReviews = reviews.filter(
        r => r.order.toString() === order._id.toString()
      );

      return {
        ...order.toObject(),
        reviews: orderReviews
      };
    });

    res.status(200).json({
      success: true,
      data: ordersWithReviews
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};