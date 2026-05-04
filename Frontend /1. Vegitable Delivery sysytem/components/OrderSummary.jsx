
"use client";

import { PlusIcon, SquarePenIcon } from "lucide-react";
import React, { useState } from "react";
import AddressModal from "./AddressModal";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

// 🔥 Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const OrderSummary = ({ totalPrice }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const router = useRouter();

  const addressList = useSelector((state) => state.address.list);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (placingOrder) return;

    if (!selectedAddress) {
      toast.error("Please select address");
      return;
    }

    try {
      setPlacingOrder(true);

      // ======================
      // 1️⃣ CREATE ORDER (BACKEND)
      // ======================
      const orderRes = await api.post("/orders", {
        shippingAddress: selectedAddress,
      });

      const order = orderRes.data.data;

      // ======================
      // 2️⃣ LOAD RAZORPAY
      // ======================
      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      // ======================
      // 3️⃣ CREATE RAZORPAY ORDER
      // ======================
      const res = await api.post("/payment/create-order", {
        orderId: order._id,
      });

      const { razorpayOrderId, amount, keyId } = res.data.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "FreshKart",
        description: "Order Payment",
        order_id: razorpayOrderId,

        handler: async function (response) {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            toast.success("Payment successful 🎉");
            router.push("/orders");

          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: selectedAddress.fullName,
          contact: selectedAddress.phone,
        },

        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new window.Razorpay(options);

      // ❌ Payment failed
      rzp.on("payment.failed", function () {
        toast.error("Payment failed ❌");
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">
        Payment Summary
      </h2>

      {/* ADDRESS */}
      <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
        <p>Address</p>

        {selectedAddress ? (
          <div className="flex gap-2 items-center">
            <div className="text-sm">
              <p className="font-medium">
                {selectedAddress.fullName} ({selectedAddress.phone})
              </p>

              <p>
                {selectedAddress.street}
                {selectedAddress.landmark &&
                  `, ${selectedAddress.landmark}`}
              </p>

              <p>
                {selectedAddress.city}, {selectedAddress.state} -{" "}
                {selectedAddress.zip}
              </p>

              <p>{selectedAddress.country}</p>
            </div>

            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className="cursor-pointer"
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className="border p-2 w-full my-3 rounded"
                onChange={(e) =>
                  setSelectedAddress(addressList[e.target.value])
                }
              >
                <option value="">Select Address</option>
                {addressList.map((addr, i) => (
                  <option key={i} value={i}>
                    {addr.fullName}, {addr.city}
                  </option>
                ))}
              </select>
            )}

            <button
              className="flex items-center gap-1"
              onClick={() => setShowAddressModal(true)}
            >
              Add Address <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      {/* TOTAL */}
      <div className="flex justify-between py-4">
        <p>Total:</p>
        <p className="font-medium">
          {currency}
          {totalPrice}
        </p>
      </div>

      {/* BUTTON */}
      <button
        disabled={placingOrder}
        onClick={handlePlaceOrder}
        className="w-full bg-slate-700 text-white py-2.5 rounded disabled:opacity-50"
      >
        {placingOrder ? "Processing..." : "Pay Now"}
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;