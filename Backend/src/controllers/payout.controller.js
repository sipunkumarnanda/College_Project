
import Order from "../models/order.model.js";

// =======================
// GET VENDOR EARNINGS
// =======================
export const getVendorPayments = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({
      "items.vendor": vendorId,
      status: "DELIVERED",
    });

    let totalEarnings = 0;
    let thisWeek = 0;

    const now = new Date();
    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);

    const transactions = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.vendor.toString() === vendorId.toString()) {
          const amount = item.price.amount * item.quantity;

          totalEarnings += amount;

          if (order.createdAt >= weekStart) {
            thisWeek += amount;
          }

          transactions.push({
            _id: `${order._id}-${item.product}`,
            orderId: order._id,
            productName: item.productName,
            amount,
            date: order.createdAt,

            // ❗ THIS WILL CHANGE LATER
            status: "pending",
          });
        }
      });
    });

    res.json({
      success: true,
      data: {
        totalEarnings,
        thisWeek,
        transactions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments" });
  }
};


//

import Payout from "../models/payout.model.js";

// =======================
// ADMIN PAY VENDOR
// =======================
export const payVendor = async (req, res) => {
  try {
    const { vendorId, amount } = req.body;

    const payout = await Payout.create({
      vendor: vendorId,
      totalAmount: amount,
      status: "paid",
      paidAt: new Date(),
    });

    res.json({
      success: true,
      message: "Vendor paid successfully",
      data: payout,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment failed" });
  }
};