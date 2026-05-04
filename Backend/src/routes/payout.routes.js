
import express from "express";
import {
  getVendorPayments,
  payVendor
} from "../controllers/payout.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { isVendor, isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// =======================
// VENDOR
// =======================

// Vendor sees earnings
router.get("/vendor", protect, isVendor, getVendorPayments);

// =======================
// ADMIN
// =======================

// Admin pays vendor
router.post("/pay", protect, isAdmin, payVendor);

export default router;