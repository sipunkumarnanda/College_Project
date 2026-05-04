
import Review from "../models/review.model.js";
import mongoose from "mongoose";

// ➕ ADD REVIEW (PER ORDER)
export const addReview = async (req, res) => {
  try {
    const { productId, rating, review, orderId } = req.body;

    // ✅ VALIDATION
    if (!productId || !orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: "productId, orderId and rating are required",
      });
    }

    // ✅ CHECK VALID OBJECT IDS
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId or orderId",
      });
    }

    // ✅ CREATE REVIEW
    const newReview = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      review,
    });

    return res.status(201).json({
      success: true,
      data: newReview,
    });

  } catch (error) {
    console.log("Review error:", error);

    // ❌ DUPLICATE (same order)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product for this order",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Error adding review",
    });
  }
};

// 📦 GET PRODUCT REVIEWS
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name image")
      .sort("-createdAt");

    return res.status(200).json({
      success: true,
      data: reviews,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};


// GET /reviews/my
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .select("product order rating review") // ⭐ IMPORTANT
      .lean();

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { productId, orderId, rating, review } = req.body;

    const existing = await Review.findOne({
      user: req.user._id,
      product: productId,
      order: orderId
    });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    existing.rating = rating;
    existing.review = review;

    await existing.save();

    res.status(200).json({
      success: true,
      data: existing
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating review" });
  }
};