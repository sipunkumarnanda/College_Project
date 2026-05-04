
'use client'

import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState(null); // ⭐ NEW

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders/my");

            if (res.data.success) {
                setOrders(res.data.data);
            }

        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-20">Loading...</div>;
    }

    return (
        <div className="min-h-[70vh] mx-6">

            {/* ⭐ MODAL */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            {orders.length > 0 ? (
                <div className="my-20 max-w-7xl mx-auto">

                    <PageTitle
                        heading="My Orders"
                        text={`Showing ${orders.length} orders`}
                        linkText="Go to home"
                    />

                   <div className="space-y-4">

  {orders.map((order) => (
    <OrderItem
      key={order._id}
      order={order}
      onClick={() => setSelectedOrder(order)}
    />
  ))}

</div>

                </div>
            ) : (
                <div className="flex justify-center py-20">
                    No orders
                </div>
            )}
        </div>
    );
}