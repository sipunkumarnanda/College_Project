
"use client";

import toast from "react-hot-toast";

const AdminSupportRequestModal = ({ request, onClose, onResolve }) => {
  if (!request) return null;

  const order = request.order || {};
  const user = request.user || {};

  const handleCall = () => {
    const phone = order?.shippingAddress?.phone;

    if (!phone) {
      toast.error("Phone number not available");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Admin Support Panel
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ================= BASIC INFO ================= */}
        <div className="space-y-2">

          <p>
            <strong>Type:</strong>{" "}
            {request.type || "N/A"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                request.status === "pending"
                  ? "text-yellow-600 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              {request.status || "N/A"}
            </span>
          </p>

          <p>
            <strong>User:</strong>{" "}
            {user.name || "Unknown User"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email || "No Email"}
          </p>

          <p>
            <strong>Source:</strong>{" "}
            <span
              className={
                request.source === "vendor"
                  ? "text-purple-600 font-semibold"
                  : "text-blue-600 font-semibold"
              }
            >
              {request.source || "N/A"}
            </span>
          </p>
        </div>

        {/* ================= MESSAGE ================= */}
        {request.message && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-gray-700">{request.message}</p>
          </div>
        )}

        {/* ================= ORDER DETAILS ================= */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Order Details</h3>

          <p>
            <strong>Order ID:</strong>{" "}
            {order._id || "N/A"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {order.status || "N/A"}
          </p>

          {/* ITEMS */}
          {order.items && order.items.length > 0 ? (
            order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>{item.productName || "Item"}</span>
                <span>
                  ₹{item.price?.amount || 0} × {item.quantity || 0}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-2">
              No items available
            </p>
          )}
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="mt-6 flex gap-3 flex-wrap">

          <button
            onClick={handleCall}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Call Customer
          </button>

          {request.status === "pending" && (
            <button
              onClick={() => onResolve(request._id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportRequestModal;