
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

export default function AdminApprove() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/vendors/pending");
      setStores(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending stores");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storeId, status) => {
    try {
      if (status === "approved") {
        await api.put(`/admin/vendors/${storeId}/approve`);
      } else {
        await api.put(`/admin/vendors/${storeId}/reject`);
      }

      setStores((prev) =>
        prev.filter((s) => s._id !== storeId)
      );

      toast.success(
        status === "approved"
          ? "Store approved"
          : "Store rejected"
      );
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Approve{" "}
        <span className="text-slate-800 font-medium">
          Stores
        </span>
      </h1>

      {stores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              <StoreInfo store={store} />

              <div className="flex gap-3 pt-2 flex-wrap">
                <button
                  onClick={() =>
                    handleApprove(store._id, "approved")
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleApprove(store._id, "rejected")
                  }
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            No Application Pending
          </h1>
        </div>
      )}
    </div>
  );
}