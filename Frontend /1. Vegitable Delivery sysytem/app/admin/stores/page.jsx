
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/vendors");
      setStores(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  const toggleIsActive = async (storeId) => {
    try {
      const res = await api.put(`/admin/vendors/${storeId}/toggle`);

      const updated = res.data.data;

      setStores((prev) =>
        prev.map((s) =>
          s._id === storeId
            ? { ...s, isActive: updated.isActive }
            : s
        )
      );

      toast.success("Updated");
    } catch (err) {
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Live <span className="text-slate-800 font-medium">Stores</span>
      </h1>

      {stores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white border p-6 rounded-lg flex justify-between"
            >
              <StoreInfo store={store} />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={store.isActive}
                  onChange={() => toggleIsActive(store._id)}
                />
                Active
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p>No stores</p>
      )}
    </div>
  );
}