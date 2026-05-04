
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import SupportRequestModal from "@/components/SupportRequestModal";

const ComplaintsPage = () => {
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);

// ✅ NEW: modal state
const [selectedRequest, setSelectedRequest] = useState(null);

// ✅ NEW: filter state
const [filter, setFilter] = useState("all"); // all | pending | resolved

// =========================
// FETCH REQUESTS
// =========================
const fetchRequests = async () => {
try {
const res = await api.get("/support/vendor/all");
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
await api.put(`/support/vendor/${id}`);


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
if (filter === "pending") return req.status === "pending";
if (filter === "resolved") return req.status === "resolved";
return true; // all
});

if (loading) return <Loading />;

return ( <div> <h1 className="text-2xl font-semibold mb-6">
Customer Support Requests </h1>


  {/* 🔥 FILTER BUTTONS */}
  <div className="flex gap-3 mb-6">
    {["all", "pending", "resolved"].map((f) => (
      <button
        key={f}
        onClick={() => setFilter(f)}
        className={`px-4 py-1 rounded border ${
          filter === f
            ? "bg-green-600 text-white"
            : "bg-white text-gray-600"
        }`}
      >
        {f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>

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
                ? "Call Request"
                : "Complaint"}
            </p>

            <p className="text-sm text-gray-500">
              Order #{req.order?._id?.slice(-6)}
            </p>

            <p className="text-sm">
              User: {req.user?.name}
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

  {/* MODAL */}
  {selectedRequest && (
    <SupportRequestModal
      request={selectedRequest}
      onClose={() => setSelectedRequest(null)}
      onResolve={handleResolve}
    />
  )}
</div>


);
};

export default ComplaintsPage;
