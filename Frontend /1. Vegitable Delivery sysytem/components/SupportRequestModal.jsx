
"use client";

import toast from "react-hot-toast";

const SupportRequestModal = ({ request, onClose, onResolve }) => {
  if (!request) return null;

  const order = request.order;

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
          <h2 className="text-xl font-semibold">Support Request</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* INFO */}
        <p><strong>Type:</strong> {request.type}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>User:</strong> {request.user?.name}</p>

        {request.message && (
          <p className="mt-2 text-gray-600">{request.message}</p>
        )}

        {/* ORDER */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Order Details</h3>

          <p><strong>Order ID:</strong> {order?._id}</p>
          <p><strong>Status:</strong> {order?.status}</p>

          {order?.items?.map((item, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{item.productName}</span>
              <span>₹{item.price?.amount} × {item.quantity}</span>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex gap-3">

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

export default SupportRequestModal;