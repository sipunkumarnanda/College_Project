
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import AdminSupportRequestModal from "@/components/AdminSupportRequestModal";

const ComplaintsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | resolved
  const [sourceFilter, setSourceFilter] = useState("all"); // all | user | vendor

  // =========================
  // FETCH REQUESTS (ADMIN)
  // =========================
  const fetchRequests = async () => {
    try {
      const res = await api.get("/support"); // ✅ FIXED (admin endpoint)
      setRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // RESOLVE REQUEST
  // =========================
  const handleResolve = async (id) => {
    try {
      await api.put(`/support/${id}`); // ✅ admin resolve

      toast.success("Marked as resolved");
      fetchRequests();
      setSelectedRequest(null);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredRequests = requests.filter((req) => {
    // Status filter
    if (statusFilter === "pending" && req.status !== "pending")
      return false;
    if (statusFilter === "resolved" && req.status !== "resolved")
      return false;

    // Source filter
    if (sourceFilter === "user" && req.source !== "user")
      return false;
    if (sourceFilter === "vendor" && req.source !== "vendor")
      return false;

    return true;
  });

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Customer Support Requests
      </h1>

      {/* ================= FILTERS ================= */}

      {/* Status Filter */}
      <div className="flex gap-3 mb-4">
        {["all", "pending", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-1 rounded border ${
              statusFilter === f
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Source Filter */}
      <div className="flex gap-3 mb-6">
        {["all", "user", "vendor"].map((s) => (
          <button
            key={s}
            onClick={() => setSourceFilter(s)}
            className={`px-4 py-1 rounded border ${
              sourceFilter === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {s === "all"
              ? "All Sources"
              : s === "user"
              ? "User"
              : "Vendor"}
          </button>
        ))}
      </div>

      {/* ================= LIST ================= */}

      {filteredRequests.length === 0 ? (
        <p className="text-gray-500">No requests found</p>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              onClick={() => setSelectedRequest(req)}
              className="border p-4 rounded flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            >
              {/* LEFT */}
              <div>
                <p className="font-semibold">
                  {req.type === "call"
                    ? "📞 Call Request"
                    : "⚠️ Complaint"}
                </p>

                <p className="text-sm text-gray-500">
                  Order #{req.order?._id?.slice(-6)}
                </p>

                <p className="text-sm">
                  User: {req.user?.name}
                </p>

                {/* SOURCE */}
                <p className="text-xs mt-1">
                  Source:{" "}
                  <span
                    className={
                      req.source === "vendor"
                        ? "text-purple-600 font-medium"
                        : "text-blue-600 font-medium"
                    }
                  >
                    {req.source}
                  </span>
                </p>

                {req.message && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {req.message}
                  </p>
                )}
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p
                  className={
                    req.status === "pending"
                      ? "text-yellow-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {req.status}
                </p>

                {req.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(req._id);
                    }}
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedRequest && (
        <AdminSupportRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
};

export default ComplaintsPage;