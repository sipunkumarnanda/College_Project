
import express from "express";
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateStatus,
} from "../controllers/support.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin, isVendor } from "../middlewares/role.middleware.js";

const router = express.Router();

// =======================
// USER ROUTES
// =======================

// Create request (call / complaint)
router.post("/", protect, createRequest);

// Get logged-in user's requests
router.get("/my", protect, getMyRequests);


// =======================
// ADMIN ROUTES
// =======================

// Admin can see all requests
router.get("/", protect, isAdmin, getAllRequests);

// Admin can update status
router.put("/:id", protect, isAdmin, updateStatus);


// =======================
// VENDOR ROUTES (optional)
// =======================

// If you ALSO want vendor to see requests:
router.get("/vendor/all", protect, isVendor, getAllRequests);

// If vendor can resolve:
router.put("/vendor/:id", protect, isVendor, updateStatus);


export default router;