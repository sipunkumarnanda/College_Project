
import SupportRequest from "../models/supportRequest.model.js";
import Order from "../models/order.model.js";

// =======================
// CREATE REQUEST
// =======================
export const createRequest = async (req, res) => {
  try {
    const { orderId, type, message } = req.body;

    if (!["call", "complaint"].includes(type)) {
      return res.status(400).json({ message: "Invalid request type" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // USER CHECK
    const isUser = order.user.toString() === req.user._id.toString();

    // VENDOR CHECK
    const isVendor = order.items.some(
      (item) => item.vendor.toString() === req.user._id.toString()
    );

    if (!isUser && !isVendor) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const existing = await SupportRequest.findOne({
      user: req.user._id,
      order: orderId,
      type,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: `${type} request already exists`,
      });
    }

    const request = await SupportRequest.create({
      user: req.user._id,
      order: orderId,
      type,
      message,
      source: req.user.role === "vendor" ? "vendor" : "user",
    });

    res.json({ success: true, data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create request" });
  }
};

// =======================
// USER REQUESTS
// =======================
export const getMyRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate({
        path: "order",
        select: "_id status shippingAddress items",
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

// =======================
// ADMIN / VENDOR VIEW
// =======================
export const getAllRequests = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "vendor") {
      const orders = await Order.find({
        "items.vendor": req.user._id,
      }).select("_id");

      const orderIds = orders.map((o) => o._id);

      query = { order: { $in: orderIds } };
    }

    const requests = await SupportRequest.find(query)
      .populate("user", "name email")
      .populate({
        path: "order",
        select: "_id status shippingAddress items",
      })
      .sort({ createdAt: -1 });

    // ✅ CLEAN RESPONSE (VERY IMPORTANT)
    const cleanData = requests.map((req) => ({
      ...req.toObject(),

      user: {
        name: req.user?.name || "Unknown User",
        email: req.user?.email || "No Email",
      },

      order: req.order
        ? {
            _id: req.order._id,
            status: req.order.status || "N/A",
            shippingAddress: req.order.shippingAddress || {},
            items: req.order.items || [],
          }
        : null,
    }));

    res.json({ success: true, data: cleanData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
};

// =======================
// UPDATE STATUS
// =======================
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SupportRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "resolved";
    request.resolvedAt = new Date();

    await request.save();

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};