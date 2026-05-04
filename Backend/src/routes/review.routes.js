
import express from "express";
import { addReview, getProductReviews , getMyReviews , updateReview} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isUser } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, isUser, addReview); // ✅ FIXED
router.get("/:productId", getProductReviews);
// get reviews by user
router.get("/my", protect, isUser, getMyReviews);

router.put("/", protect, isUser, updateReview);

export default router;