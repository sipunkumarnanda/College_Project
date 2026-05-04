"use client";

import Loading from "@/components/Loading";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StarIcon,
  TagsIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function DashboardClient() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ⭐ NEW
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Earnings",
      value: currency + dashboardData.totalEarnings,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: TagsIcon,
    },
    {
      title: "Total Ratings",
      value: dashboardData.ratings.length,
      icon: StarIcon,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/vendor/stats");

      if (res.data.success) {
        setDashboardData({
          totalProducts: res.data.data.totalProducts,
          totalEarnings: res.data.data.totalRevenue,
          totalOrders: res.data.data.totalOrders,
          ratings: res.data.data.ratings || [],
        });
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      // ❌ Handle all blocked cases here
      if (error.response?.status === 403) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Please login to access dashboard");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================= 🔴 LOADING =================
  if (loading) return <Loading />;

  // ================= 🔴 ERROR BOX =================
  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="bg-red-100 border border-red-300 text-red-700 p-6 rounded-md w-[360px] text-center shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  // ================= ✅ DASHBOARD =================
  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Seller <span className="text-slate-800 font-medium">Dashboard</span>
      </h1>

      {/* Cards */}
      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg"
          >
            <div className="flex flex-col gap-3 text-xs">
              <p>{card.title}</p>
              <b className="text-2xl font-medium text-slate-700">
                {card.value}
              </b>
            </div>

            <card.icon
              size={50}
              className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
            />
          </div>
        ))}
      </div>

      {/* Reviews */}
      <h2 className="text-lg font-medium text-slate-700">
        Total Reviews
      </h2>

      <div className="mt-5">
        {dashboardData.ratings.length === 0 ? (
          <p className="text-sm text-slate-400">No reviews yet</p>
        ) : (
          dashboardData.ratings.map((review, index) => (
            <div
              key={index}
              className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl"
            >
              <div>
                <div className="flex gap-3">
                  <Image
                    src={review.user?.image || "/default-user.png"}
                    alt="user"
                    className="w-10 rounded-full"
                    width={100}
                    height={100}
                  />
                  <div>
                    <p className="font-medium">
                      {review.user?.name || "User"}
                    </p>
                    <p className="text-slate-500">
                      {new Date(review.createdAt).toDateString()}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-slate-500 max-w-xs">
                  {review.review}
                </p>
              </div>

              <div className="flex flex-col gap-6 sm:items-end">
                <div>
                  <p className="text-slate-400">
                    {review.product?.category}
                  </p>
                  <p className="font-medium">
                    {review.product?.name}
                  </p>

                  <div className="flex">
                    {Array(5).fill("").map((_, i) => (
                      <StarIcon
                        key={i}
                        size={17}
                        fill={
                          review.rating >= i + 1
                            ? "#00C950"
                            : "#D1D5DB"
                        }
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    review.product?._id &&
                    router.push(`/product/${review.product._id}`)
                  }
                  className="bg-slate-100 px-5 py-2 rounded"
                >
                  View Product
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}