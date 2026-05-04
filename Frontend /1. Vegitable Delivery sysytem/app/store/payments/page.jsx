
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import PaymentSupportModal from "@/components/PaymentSupportModal";

const PaymentsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payout/vendor");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <Loading />;
  if (!data) return <p>No payment data</p>;

  // ✅ GROUP BY ORDER
  const grouped = {};

  data.transactions.forEach((t) => {
    if (!grouped[t.orderId]) {
      grouped[t.orderId] = {
        total: 0,
        date: t.date,
      };
    }
    grouped[t.orderId].total += t.amount;
  });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const weekEnd = new Date();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Payments</h1>

      {/* WEEK HEADER */}
      <div className="border p-4 rounded mb-6 bg-gray-50">
        <p className="text-sm text-gray-500">
          {weekStart.toDateString()} – {weekEnd.toDateString()}
        </p>

        <p className="text-xl font-semibold">
          Weekly Earnings: ₹{data.thisWeek}
        </p>
      </div>

      {/* TOTAL */}
      <div className="border p-4 rounded mb-6">
        <p>Total Earnings</p>
        <p className="text-xl font-semibold">₹{data.totalEarnings}</p>
      </div>

      {/* ORDERS */}
      <div className="space-y-3">
        {Object.keys(grouped).map((orderId) => (
          <div
            key={orderId}
            onClick={() => setSelectedOrder(orderId)}
            className="border p-4 rounded flex justify-between cursor-pointer hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">
                Order #{orderId.slice(-6)}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(grouped[orderId].date).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ₹{grouped[orderId].total}
              </p>
              <p className="text-sm text-yellow-600">
                pending
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedOrder && (
        <PaymentSupportModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default PaymentsPage;