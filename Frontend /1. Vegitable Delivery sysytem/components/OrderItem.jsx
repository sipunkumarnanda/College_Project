
'use client'

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function OrderItem({ order, onClick }) {

  const isDelivered = order.status === "DELIVERED";

  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // ✅ PRODUCT ID
  const productId =
    order.items[0]?.product?._id || order.items[0]?.product;

  // ✅ LOCAL REVIEW STATE (IMPORTANT)
  const [localReview, setLocalReview] = useState(() => {
    return order.reviews?.find(
      (r) => r.product?.toString() === productId?.toString()
    ) || null;
  });

  // ✅ SUBMIT / UPDATE REVIEW
  const handleSubmit = async () => {
    try {
      const item = order.items[0];

      const payload = {
        productId: item.product?._id || item.product,
        orderId: order._id,
        rating,
        review
      };

      let res;

      if (localReview) {
        // ✏️ UPDATE
        res = await api.put("/reviews", payload);
        toast.success("Review updated");
      } else {
        // ➕ CREATE
        res = await api.post("/reviews", payload);
        toast.success("Review added");
      }

      // ✅ UPDATE UI WITHOUT RELOAD
      setLocalReview(res.data.data);

      setShowReview(false);

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="border rounded-xl p-5 flex justify-between items-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
      >

        {/* LEFT */}
        <div>
          <p className="font-semibold">
            {order.items?.[0]?.productName}
          </p>
          <p className="text-sm text-gray-500">
            {order.items.length} items
          </p>
        </div>

        {/* TOTAL */}
        <div>₹{order.totalPrice?.amount}</div>

        {/* ADDRESS */}
        <div>{order.shippingAddress?.city}</div>

        {/* STATUS + REVIEW */}
        <div className="flex flex-col items-end gap-1">

          {/* STATUS */}
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
            {order.status}
          </span>

          {/* ⭐ REVIEW SECTION */}
          {isDelivered && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-sm"
            >

              {/* ⭐ SHOW STARS */}
              <div className="flex text-lg">
                {[1,2,3,4,5].map((star)=>(
                  <span
                    key={star}
                    className={
                      (localReview?.rating || 0) >= star
                        ? "text-green-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* BUTTON */}
              {localReview ? (
                <span
                  onClick={(e)=>{
                    e.stopPropagation();
                    setRating(localReview.rating);
                    setReview(localReview.review);
                    setShowReview(true);
                  }}
                  className="text-green-600 text-xs cursor-pointer mt-1"
                >
                  Reviewed (Edit)
                </span>
              ) : (
                <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    setRating(0);
                    setReview("");
                    setShowReview(true);
                  }}
                  className="text-blue-600 text-xs mt-1"
                >
                  Write Review
                </button>
              )}

            </div>
          )}

        </div>
      </div>

      {/* ⭐ MODAL */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-lg w-96">

            <h3 className="font-semibold mb-3">
              {localReview ? "Edit Review" : "Write Review"}
            </h3>

            {/* ⭐ CLICKABLE STARS */}
            <div className="flex text-2xl mb-3">
              {[1,2,3,4,5].map((star)=>(
                <span
                  key={star}
                  onClick={()=>setRating(star)}
                  className={`cursor-pointer ${
                    rating >= star
                      ? "text-green-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* TEXT */}
            <textarea
              value={review}
              onChange={(e)=>setReview(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={()=>setShowReview(false)}>
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {localReview ? "Update" : "Submit"}
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}