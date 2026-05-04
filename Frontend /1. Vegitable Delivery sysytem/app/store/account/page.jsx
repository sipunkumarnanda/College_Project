
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AccountModal from "@/components/AccountModal";
import toast from "react-hot-toast";

const AccountPage = () => {
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBankDetails = async () => {
    try {
      const res = await api.get("/vendor/account");
      setBank(res.data.data);
    } catch (err) {
      toast.error("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  // mask account number
  const maskAccount = (acc) => {
    if (!acc) return "";
    return "****" + acc.slice(-4);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Account Details</h1>

      {!bank || !bank.accountNumber ? (
        // 🔴 NO DATA
        <div className="border p-6 rounded">
          <p className="text-gray-500 mb-4">
            No bank details added yet
          </p>

          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Bank Details
          </button>
        </div>
      ) : (
        // 🟢 SHOW DATA
        <div className="border p-6 rounded space-y-2">
          <p>
            <strong>Account Number:</strong>{" "}
            {bank.accountNumber}
          </p>

          <p>
            <strong>Bank:</strong> {bank.bankName}
          </p>

          <p>
            <strong>IFSC:</strong> {bank.ifsc}
          </p>

          <p>
            <strong>Holder:</strong> {bank.holderName}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Details
          </button>
        </div>
      )}

      {open && (
        <AccountModal
          onClose={() => {
            setOpen(false);
            fetchBankDetails(); // 🔥 refresh after save
          }}
        />
      )}
    </div>
  );
};

export default AccountPage;