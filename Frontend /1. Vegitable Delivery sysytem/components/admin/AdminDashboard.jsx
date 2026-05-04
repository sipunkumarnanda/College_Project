
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Loading from "@/components/Loading";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    allOrders: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsRes = await api.get("/admin/stats");
      const ordersRes = await api.get("/admin/orders-stats");

      const stats = statsRes.data.data;
      const orders = ordersRes.data.data;

      setDashboardData({
        products: stats?.products || 0,
        revenue: stats?.revenue || 0,
        orders: stats?.orders || 0,
        stores: stats?.stores || 0,
        allOrders: orders || [],
      });

    } catch (err) {
      console.error(err);

      // ❌ Not logged in / expired
      if (err.response?.status === 401) {
        toast.error("Session expired, please login again");
        router.push("/login?error=session-expired");
        return;
      }

      // ❌ Not admin (extra safety)
      if (err.response?.status === 403) {
        toast.error("Only admins can access this page");
        router.push("/?error=not-admin");
        return;
      }

      toast.error("Failed to load dashboard");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.products,
      icon: ShoppingBasketIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.revenue,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Total Orders",
      value: dashboardData.orders,
      icon: TagsIcon,
    },
    {
      title: "Total Stores",
      value: dashboardData.stores,
      icon: StoreIcon,
    },
  ];

  return (
    <div className="text-slate-500">
      <h1 className="text-2xl">
        Admin{" "}
        <span className="text-slate-800 font-medium">
          Dashboard
        </span>
      </h1>

      {/* CARDS */}
      <div className="flex flex-wrap gap-5 my-10 mt-4">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg"
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

      {/* CHART */}
      {dashboardData.allOrders?.length > 0 && (
        <OrdersAreaChart allOrders={dashboardData.allOrders} />
      )}
    </div>
  );
}