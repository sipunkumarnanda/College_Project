
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

export default function Dashboard() {
const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
const router = useRouter();

const [loading, setLoading] = useState(true);
const [dashboardData, setDashboardData] = useState({
totalProducts: 0,
totalEarnings: 0,
totalOrders: 0,
ratings: [],
});

const fetchDashboardData = async () => {
try {
const res = await api.get("/vendor/stats");


  if (res.data?.success) {
    setDashboardData({
      totalProducts: res.data.data.totalProducts || 0,
      totalEarnings: res.data.data.totalRevenue || 0,
      totalOrders: res.data.data.totalOrders || 0,
      ratings: res.data.data.ratings || [],
    });
  } else {
    throw new Error("Invalid response");
  }
} catch (error) {
  console.error(
    "Dashboard error:",
    error.response?.data || error.message
  );

  // ❗ fallback to avoid infinite loading
  setDashboardData({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
  });
} finally {
  setLoading(false); // ✅ VERY IMPORTANT
}


};

useEffect(() => {
fetchDashboardData();
}, []);

if (loading) return <Loading />;

return ( <div className="text-slate-500 mb-28"> <h1 className="text-2xl">
Seller{" "} <span className="text-slate-800 font-medium">
Dashboard </span> </h1>


  {/* CARDS */}
  <div className="flex flex-wrap gap-5 my-10 mt-4">
    <Card
      title="Total Products"
      value={dashboardData.totalProducts}
      icon={ShoppingBasketIcon}
    />
    <Card
      title="Total Earnings"
      value={currency + dashboardData.totalEarnings}
      icon={CircleDollarSignIcon}
    />
    <Card
      title="Total Orders"
      value={dashboardData.totalOrders}
      icon={TagsIcon}
    />
    <Card
      title="Total Ratings"
      value={dashboardData.ratings.length}
      icon={StarIcon}
    />
  </div>

  {/* REVIEWS */}
  <h2 className="text-lg font-medium text-slate-700">
    Customer Reviews
  </h2>

  <div className="mt-5">
    {dashboardData.ratings.length === 0 ? (
      <p className="text-sm text-slate-400">
        No reviews yet
      </p>
    ) : (
      dashboardData.ratings.map((review, index) => (
        <div key={index} className="border-b py-4">
          <div className="flex gap-3">
            <Image
              src={review.user?.image || "/default-user.png"}
              alt="user"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p>{review.user?.name || "User"}</p>
              <p className="text-xs text-gray-400">
                {review.createdAt
                  ? new Date(review.createdAt).toDateString()
                  : ""}
              </p>
            </div>
          </div>

          <p className="mt-2">{review.review}</p>

          <button
            onClick={() =>
              review.product?._id &&
              router.push(`/product/${review.product._id}`)
            }
            className="mt-2 bg-gray-100 px-3 py-1 rounded"
          >
            View Product
          </button>
        </div>
      ))
    )}
  </div>
</div>


);
}

// 🔥 reusable card
const Card = ({ title, value, icon: Icon }) => (

  <div className="flex items-center gap-6 border p-4 rounded">
    <div>
      <p className="text-sm">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
    <Icon className="w-10 h-10 bg-gray-100 p-2 rounded" />
  </div>
);
