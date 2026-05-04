
"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { setAddresses } from "@/lib/features/address/addressSlice";
import AddressModal from "@/components/AddressModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";

const AccountPage = () => {
  const { user } = useSelector((state) => state.auth);
  const addressList = useSelector((state) => state.address.list);
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Address modal
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // ✅ Order modal state (FIX ADDED)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // ✅ Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, meRes] = await Promise.all([
          api.get("/orders/my"),
          api.get("/auth/me"),
        ]);

        setOrders(ordersRes.data?.data || []);
        dispatch(setAddresses(meRes.data.data.addresses || []));
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, [dispatch]);

  // ✅ Delete address
  const handleDelete = async (index) => {
    try {
      setLoading(true);

      const res = await api.delete(`/address/${index}`);
      dispatch(setAddresses(res.data.data));

      toast.success("Address deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Set default address
  const handleSetDefault = async (index) => {
    try {
      const res = await api.put(`/address/default/${index}`);
      dispatch(setAddresses(res.data.data));

      toast.success("Default updated");
    } catch {
      toast.error("Failed");
    }
  };

  // ✅ Edit address
  const handleEdit = (addr, index) => {
    setEditData(addr);
    setEditIndex(index);
    setShowModal(true);
  };

  // ✅ Handle order click (FIX ADDED)
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      
      {/* PROFILE */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* ADDRESSES */}
      <div className="bg-white shadow p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Addresses</h2>

          <button
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Add Address
          </button>
        </div>

        {addressList.length === 0 ? (
          <p>No address found</p>
        ) : (
          <div className="space-y-4">
            {addressList.map((addr, index) => (
              <div key={index} className="border p-4 rounded">
                <p className="font-medium">
                  {addr.fullName} ({addr.phone})
                </p>

                <p className="text-sm text-gray-500">
                  {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                </p>

                {addr.isDefault && (
                  <span className="text-green-600 text-xs font-semibold">
                    Default
                  </span>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleEdit(addr, index)}
                    className="text-yellow-600 text-sm"
                  >
                    Edit
                  </button>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(index)}
                      className="text-blue-500 text-sm"
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ORDERS */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleOrderClick(order)} // ✅ CLICK ENABLED
                className="border p-4 rounded flex justify-between cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    Order ID: {order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-green-600 font-semibold">
                    ₹{order.totalPrice?.amount}
                  </p>
                  <p className="text-sm">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADDRESS MODAL */}
      {showModal && (
        <AddressModal
          setShowAddressModal={setShowModal}
          editData={editData}
          editIndex={editIndex}
        />
      )}

      {/* ✅ ORDER MODAL (FIX ADDED) */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
};

export default AccountPage;