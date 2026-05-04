
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const AccountModal = ({ onClose }) => {
  const [form, setForm] = useState({
    accountNumber: "",
    bankName: "",
    ifsc: "",
    holderName: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ✅ FETCH EXISTING BANK DETAILS
  const fetchDetails = async () => {
    try {
      const res = await api.get("/vendor/account");

      if (res.data?.data) {
        setForm({
          accountNumber: res.data.data.accountNumber || "",
          bankName: res.data.data.bankName || "",
          ifsc: res.data.data.ifsc || "",
          holderName: res.data.data.holderName || "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bank details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // ✅ SAVE / UPDATE
  const handleSubmit = async () => {
    if (!form.accountNumber || !form.bankName || !form.ifsc || !form.holderName) {
      return toast.error("All fields required");
    }

    try {
      setLoading(true);

      await api.post("/vendor/account", form);

      toast.success("Bank details updated");
      onClose();
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">

        <h2 className="text-lg font-semibold mb-4">Bank Details</h2>

        {/* LOADING STATE */}
        {fetching ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <input
              value={form.accountNumber}
              placeholder="Account Number"
              className="border p-2 w-full mb-2 rounded"
              onChange={(e) =>
                setForm({ ...form, accountNumber: e.target.value })
              }
            />

            <input
              value={form.bankName}
              placeholder="Bank Name"
              className="border p-2 w-full mb-2 rounded"
              onChange={(e) =>
                setForm({ ...form, bankName: e.target.value })
              }
            />

            <input
              value={form.ifsc}
              placeholder="IFSC"
              className="border p-2 w-full mb-2 rounded"
              onChange={(e) =>
                setForm({ ...form, ifsc: e.target.value })
              }
            />

            <input
              value={form.holderName}
              placeholder="Account Holder Name"
              className="border p-2 w-full mb-4 rounded"
              onChange={(e) =>
                setForm({ ...form, holderName: e.target.value })
              }
            />
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;