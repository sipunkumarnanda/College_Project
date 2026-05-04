
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const PaymentSupportModal = ({ orderId, onClose }) => {
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH EXISTING REQUESTS
  const fetchRequests = async () => {
    try {
      const res = await api.get("/support/my");

      const filtered = res.data.data.filter(
        (r) => r.order?._id === orderId
      );

      setRequests(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ CREATE REQUEST
  const handleSubmit = async (type) => {
    if (type === "complaint" && !message.trim()) {
      return toast.error("Please write your complaint");
    }

    try {
      setLoading(true);

      await api.post("/support", {
        orderId,
        type,
        message,
      });

      toast.success(
        type === "call"
          ? "Call request sent"
          : "Complaint submitted"
      );

      setMessage("");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Payment Support
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ORDER */}
        <p className="text-sm text-gray-500 mb-4">
          Order #{orderId.slice(-6)}
        </p>

        {/* TEXTAREA */}
        <textarea
          placeholder="Write your complaint..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border w-full p-2 rounded mb-4"
        />

        {/* BUTTONS */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleSubmit("call")}
            disabled={loading}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Request Call
          </button>

          <button
            onClick={() => handleSubmit("complaint")}
            disabled={loading}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Raise Complaint
          </button>
        </div>

        {/* STATUS */}
        <div>
          <h3 className="font-medium mb-2">Your Requests</h3>

          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No requests yet
            </p>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="border p-2 rounded flex justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {r.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.message}
                    </p>
                  </div>

                  <span
                    className={
                      r.status === "pending"
                        ? "text-yellow-600 text-sm"
                        : "text-green-600 text-sm"
                    }
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentSupportModal;