
import express from 'express';
import {
  registerVendor,
  getVendorProducts,
  getVendorOrders,
  updateOrderStatus,
  getVendorStats,
  getInvoice,
  saveBankDetails,
  getBankDetails
} from '../controllers/vendor.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import { vendorApproved } from '../middlewares/vendor.middleware.js';
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// 🔹 Vendor Core
router.post("/register", protect, upload.single("image"), registerVendor);
router.get('/products', protect, vendorApproved, getVendorProducts);
router.get('/orders', protect, vendorApproved, getVendorOrders);
router.put("/orders/:id/status", protect, vendorApproved, updateOrderStatus);
router.get("/stats", protect, vendorApproved, getVendorStats);
router.get("/orders/:id/invoice", protect, vendorApproved, getInvoice);

// 🔹 Bank Details
router.post("/account", protect, vendorApproved, saveBankDetails);
router.get("/account", protect, vendorApproved, getBankDetails);

export default router;