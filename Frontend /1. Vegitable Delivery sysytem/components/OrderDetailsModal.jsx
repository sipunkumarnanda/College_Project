
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const OrderDetailsModal = ({ order, onClose }) => {
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (!order) return null;

  // =========================
  // LOAD REQUESTS
  // =========================
  const loadRequests = async () => {
    try {
      const res = await api.get("/support/my");
      setRequests(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // =========================
  // HANDLE REQUEST
  // =========================
  const handleRequest = async (type) => {
    try {
      setLoading(true);

      await api.post("/support", {
        orderId: order._id,
        type,
        message,
      });

      toast.success(
        type === "call"
          ? "Call request sent"
          : "Complaint submitted"
      );

      setMessage("");
      loadRequests();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER REQUESTS
  // =========================
  const orderRequests = requests.filter(
    (r) => r.order === order._id || r.order?._id === order._id
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ORDER INFO */}
        <p><strong>Order ID:</strong> {order._id}</p>
        <p>
          <strong>Payment Status:</strong>{" "}
          <span className={
            order.paymentStatus === "PAID"
              ? "text-green-600"
              : order.paymentStatus === "FAILED"
              ? "text-red-600"
              : "text-yellow-600"
          }>
            {order.paymentStatus}
          </span>
        </p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

        {/* ADDRESS */}
        <div className="mt-4">
          <h3 className="font-semibold">Shipping Address</h3>
          <p>{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.street}</p>
          <p>
            {order.shippingAddress?.city}, {order.shippingAddress?.state}
          </p>
        </div>

        {/* ITEMS */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Items</h3>

          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between border-b py-2">

              <div>
                <p>{item.productName}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p>₹{item.price?.amount}</p>

                {/* ⭐ REVIEW BUTTON */}
                {order.paymentStatus === "PAID" && (
                  <button
                    onClick={() => router.push(`/product/${item.product}`)}
                    className="text-sm text-blue-600 underline"
                  >
                    Review Product
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4 font-semibold text-right">
          Total: ₹{order.totalPrice?.amount}
        </div>

        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}
        <div className="mt-6 space-y-3">

          <button
            disabled={loading}
            onClick={() => handleRequest("call")}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Processing..." : "Request a Call"}
          </button>

          <textarea
            placeholder="Write your complaint..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            disabled={loading || !message}
            onClick={() => handleRequest("complaint")}
            className="bg-red-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Submitting..." : "Raise a Complaint"}
          </button>
        </div>

        {/* ========================= */}
        {/* SUPPORT STATUS */}
        {/* ========================= */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Support Status</h3>

          {orderRequests.length === 0 ? (
            <p className="text-gray-500">No requests yet</p>
          ) : (
            orderRequests.map((req) => (
              <div
                key={req._id}
                className="border p-3 rounded mb-2 flex justify-between"
              >
                <div>
                  <p className="font-medium">
                    {req.type === "call" ? "Call Request" : "Complaint"}
                  </p>
                  {req.message && (
                    <p className="text-sm text-gray-500">
                      {req.message}
                    </p>
                  )}
                </div>

                <span className={
                  req.status === "pending"
                    ? "text-yellow-600"
                    : "text-green-600"
                }>
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;