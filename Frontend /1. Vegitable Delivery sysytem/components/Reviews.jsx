
"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import api from "@/lib/api";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH REVIEWS
  // =========================
  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${productId}`);
        setReviews(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // =========================
  // CALCULATE AVERAGE
  // =========================
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      : 0;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-16 px-6">
        <p className="text-gray-500 text-sm">Loading reviews...</p>
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!reviews.length) {
    return (
      <div className="max-w-6xl mx-auto mt-16 px-6">
        <h2 className="text-lg font-semibold mb-4">
          Customer Reviews
        </h2>
        <p className="text-gray-500 text-sm">
          No reviews yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-16 px-6">

      {/* HEADER */}
      <h2 className="text-lg font-semibold mb-4">
        Customer Reviews
      </h2>

      {/* ⭐ AVERAGE RATING */}
      <div className="flex items-center gap-3 mb-6">

        <div className="flex">
          {Array(5).fill("").map((_, i) => (
            <StarIcon
              key={i}
              size={18}
              fill={averageRating >= i + 1 ? "#00C950" : "#D1D5DB"}
            />
          ))}
        </div>

        <span className="text-sm text-gray-600">
          {averageRating.toFixed(1)} out of 5
        </span>

        <span className="text-sm text-gray-400">
          ({reviews.length} reviews)
        </span>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-6">

        {reviews.map((review) => (
          <div
            key={review._id}
            className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm"
          >

            {/* TOP */}
            <div className="flex items-center justify-between">

              <p className="font-medium text-gray-800">
                {review.user?.name || "Anonymous"}
              </p>

              <div className="flex">
                {Array(5).fill("").map((_, i) => (
                  <StarIcon
                    key={i}
                    size={16}
                    fill={review.rating >= i + 1 ? "#00C950" : "#D1D5DB"}
                  />
                ))}
              </div>

            </div>

            {/* COMMENT */}
            <p className="text-gray-600 mt-2 text-sm">
              {review.review || "No comment provided."}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default Reviews;