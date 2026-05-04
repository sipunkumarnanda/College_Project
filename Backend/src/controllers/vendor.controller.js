
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import PDFDocument from "pdfkit";
import User from "../models/user.model.js";
import uploadFile from "../services/storage.service.js";


// register
export const registerVendor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.store?.name) {
      return res.status(400).json({
        message: "You already registered a store",
      });
    }

    const {
      name,
      description,
      contact,
      address,
      pincode,
      area,
      image,
    } = req.body;

    if (!name || !contact || !address || !area) {
      return res.status(400).json({
        message: "Please fill required fields",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const uploaded = await uploadFile(req.file);
      imageUrl = uploaded.url;
    } else if (image) {
      imageUrl = image;
    }

    user.store = {
      name,
      description,
      contact,
      address,
      pincode,
      area,
      image: imageUrl,
      status: "pending", // ✅ ONLY STATUS
    };

    user.role = "vendor";

    await user.save();

    res.json({
      success: true,
      message: "Store submitted for approval",
      data: user.store,
    });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};


// GET /api/vendor/products
export const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/vendor/orders

export const getVendorOrders = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ ONLY FETCH RELEVANT ORDERS
    const orders = await Order.find({
  "items.vendor": req.user._id
})
.populate({
  path: "user",
  select: "name email phone",
})
.populate({
  path: "items.product",
  select: "name price vendor"
})
.sort("-createdAt");

    const vendorOrders = orders.map((order) => {

      const vendorItems = order.items.filter(
        (item) =>
          item.vendor &&
          item.vendor.toString() === req.user._id.toString()
      );

      // 🔥 CALCULATE TOTAL
      const vendorTotal = vendorItems.reduce((sum, item) => {

        const price =
          item.price?.amount ||
          item.product?.price ||
          0;

        return sum + price * item.quantity;

      }, 0);

      return {
        _id: order._id,

        // ✅ FULL USER
        user: order.user,

        items: vendorItems,

        // ✅ TOTAL
        totalPrice: {
          amount: vendorTotal,
          currency: "INR",
        },

        // ✅ IMPORTANT FIELDS (ADD THESE)
        status: order.status,
        paymentStatus: order.paymentStatus || "COD", // ⭐ FIX
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,

      };
    });

    res.status(200).json({
      success: true,
      data: vendorOrders,
    });

  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};





// PUT /api/orders/:id/status

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // 🔐 Only vendor
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔹 Validate status
    const validStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 🔹 Find order
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔹 Check vendor owns at least one product in order
    const hasVendorProduct = order.items.some(
      (item) =>
        item.product &&
        item.product.vendor.toString() === req.user._id.toString()
    );

    if (!hasVendorProduct) {
      return res.status(403).json({ message: "Not your order" });
    }

    // 🔹 Update status
    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });

  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// GET /api/vendor/stats

export const getVendorStats = async (req, res) => {
  try {
    // ❌ must be vendor
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    // ❌ must be ACTIVE
    if (!req.user.isActive) {
      return res.status(403).json({
        message: "Store is disabled by admin",
      });
    }

    // ❌ must be APPROVED
    if (!req.user.store || req.user.store.status !== "approved") {
      return res.status(403).json({
        message: "Store not approved yet",
      });
    }

    const vendorId = req.user._id;

    // =========================
    // 🟢 PRODUCTS
    // =========================
    const totalProducts = await Product.countDocuments({
      vendor: vendorId,
    });

    // =========================
    // 🟢 ORDERS + REVENUE
    // =========================
    const orders = await Order.find({
      "items.vendor": vendorId,
    });

    let totalOrders = orders.length;
    let totalRevenue = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.vendor.toString() === vendorId.toString()) {
          totalRevenue += item.price.amount * item.quantity;
        }
      });
    });

    // =========================
    // 🟢 RATINGS
    // =========================
    const ratings = await Review.find()
      .populate({
        path: "product",
        match: { vendor: vendorId },
        select: "name category vendor",
      })
      .populate("user", "name image")
      .sort("-createdAt")
      .limit(5);

    const filteredRatings = ratings.filter((r) => r.product);

    const formattedRatings = filteredRatings.map((r) => ({
      user: {
        name: r.user?.name,
        image: r.user?.image,
      },
      product: {
        id: r.product?._id,
        name: r.product?.name,
        category: r.product?.category,
      },
      rating: r.rating,
      review: r.review,
      createdAt: r.createdAt,
    }));

    // =========================
    // ✅ RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        ratings: formattedRatings,
      },
    });

  } catch (error) {
    console.error("Vendor stats error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};


//  GET /api/vendor/orders/:id/invoice

export const getInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findById(orderId)
      .populate("items.product", "name vendor");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Vendor items only
    const vendorItems = order.items.filter(
      (item) =>
        item.vendor.toString() === req.user._id.toString()
    );

    if (vendorItems.length === 0) {
      return res.status(403).json({ message: "No access" });
    }

    // ✅ SMALL RECEIPT SIZE (BEST FOR PRINT)
    const doc = new PDFDocument({
      size: [250, 600], // width x height
      margin: 10,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");

    doc.pipe(res);

    // =========================
    // HEADER
    // =========================
    doc.fontSize(14).text("FreshKart", { align: "center" });
    doc.fontSize(9).text("Delivery Receipt", { align: "center" });
    doc.moveDown(0.5);

    // =========================
    // ORDER INFO
    // =========================
    doc.fontSize(8);
    doc.text(`Order: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Payment: ${order.paymentStatus}`);
    doc.moveDown(0.5);

    // =========================
    // CUSTOMER
    // =========================
    doc.text("Customer:", { underline: true });

    doc.text(order.shippingAddress?.fullName || "N/A");
    doc.text(order.shippingAddress?.phone || "");

    doc.text(
      `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}`
    );
    doc.text(
      `${order.shippingAddress?.state || ""} - ${order.shippingAddress?.zip || ""}`
    );

    doc.moveDown(0.5);

    // =========================
    // ITEMS
    // =========================
    doc.text("Items:", { underline: true });

    let totalAmount = 0;

    vendorItems.forEach((item, index) => {
      const name = item.productName || item.product?.name || "Item";
      const price = item.price.amount;
      const qty = item.quantity;
      const total = price * qty;

      totalAmount += total;

      doc.text(`${index + 1}. ${name}`);
      doc.text(`   ${qty} x ₹${price} = ₹${total}`);
      doc.moveDown(0.3);
    });

    doc.moveDown(0.5);

    // =========================
    // TOTAL
    // =========================
    doc.fontSize(10).text(
      `TOTAL: ₹${totalAmount}`,
      { align: "right" }
    );

    doc.moveDown(0.5);

    // =========================
    // FOOTER
    // =========================
    doc.fontSize(8).text(
      "Thank you for shopping!",
      { align: "center" }
    );

    doc.end();

  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


//

// =======================
// SAVE / UPDATE BANK DETAILS
// ======================
// SAVE BANK DETAILS
// =======================
export const saveBankDetails = async (req, res) => {
  try {
    const { accountNumber, bankName, ifsc, holderName } = req.body;

    const user = await User.findById(req.user._id);

    if (!user || user.role !== "vendor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    user.bankDetails = {
      accountNumber,
      bankName,
      ifsc,
      holderName,
    };

    await user.save();

    res.json({
      success: true,
      message: "Bank details saved",
      data: user.bankDetails,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to save bank details" });
  }
};

// =======================
// GET BANK DETAILS
// =======================
export const getBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user.bankDetails || {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bank details" });
  }
};