
'use client'

import { useEffect, useState, useRef, useCallback } from "react"
import Loading from "@/components/Loading"
import api from "@/lib/api"

export default function StoreOrders() {

const [orders, setOrders] = useState([])
const [filteredOrders, setFilteredOrders] = useState([])
const [loading, setLoading] = useState(true)

const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)

const observer = useRef()
const scrollRef = useRef()

const [selectedOrder, setSelectedOrder] = useState(null)
const [isModalOpen, setIsModalOpen] = useState(false)

const today = new Date().toISOString().split("T")[0]

const [fromDate, setFromDate] = useState("")
const [toDate, setToDate] = useState("")

// 🔒 LOCK BACKGROUND SCROLL
useEffect(() => {
if (isModalOpen) {
document.body.style.overflow = "hidden"
} else {
document.body.style.overflow = "auto"
}

return () => {
document.body.style.overflow = "auto"
}
}, [isModalOpen])

// ✅ FETCH ORDERS
const fetchOrders = async (pageNumber = 1) => {
try {
const res = await api.get(`/vendor/orders?page=${pageNumber}&limit=10`)

if (res.data.success) {
const newOrders = res.data.data


setOrders(prev =>
  pageNumber === 1 ? newOrders : [...prev, ...newOrders]
)

setFilteredOrders(prev =>
  pageNumber === 1 ? newOrders : [...prev, ...newOrders]
)

if (newOrders.length < 10) {
  setHasMore(false)
}


}
} catch (error) {
console.error("Orders error:", error)
} finally {
setLoading(false)
}

}

useEffect(() => {
fetchOrders(page)
}, [page])

// ✅ INFINITE SCROLL
const lastRowRef = useCallback((node) => {
if (loading) return

if (observer.current) observer.current.disconnect()

observer.current = new IntersectionObserver(
entries => {
if (entries[0].isIntersecting && hasMore) {
setPage(prev => prev + 1)
}
},
{
root: scrollRef.current,
}
)

if (node) observer.current.observe(node)

}, [loading, hasMore])

// ✅ STATUS UPDATE
const updateOrderStatus = async (orderId, status) => {
try {
await api.put(`/vendor/orders/${orderId}/status`, { status })

setOrders(prev =>
prev.map(o =>
o._id === orderId ? { ...o, status } : o
)
)

setFilteredOrders(prev =>
prev.map(o =>
o._id === orderId ? { ...o, status } : o
)
)
} catch (error) {
console.error("Update status error:", error)
}
}

const openModal = (order) => {
setSelectedOrder(order)
setIsModalOpen(true)
}

const closeModal = () => {
setSelectedOrder(null)
setIsModalOpen(false)
}

// ✅ FILTER
const handleFilter = () => {
if (!fromDate || !toDate) return

if (fromDate > toDate) {
alert("From date cannot be greater than To date")
return
}

const from = new Date(fromDate)
const to = new Date(toDate)
to.setHours(23, 59, 59, 999)

const result = orders.filter(order => {
const orderDate = new Date(order.createdAt)
return orderDate >= from && orderDate <= to
})

setFilteredOrders(result)
}

const handleReset = () => {
setFilteredOrders(orders)
setFromDate("")
setToDate("")
}

const handlePrintInvoice = async (orderId) => {
try {
const res = await api.get(`/vendor/orders/${orderId}/invoice`, {
responseType: "blob",
})

const file = new Blob([res.data], { type: "application/pdf" })
const fileURL = URL.createObjectURL(file)

const newWindow = window.open(fileURL)
newWindow.onload = () => newWindow.print()

} catch (error) {
console.error("Invoice error:", error)
}
}

if (loading && orders.length === 0) return <Loading />

return (

<div className="p-2 sm:p-4">

  <h1 className="text-xl sm:text-2xl text-slate-500 mb-4">
    Store <span className="text-slate-800 font-medium">Orders</span>
  </h1>

{/* MAIN CARD */}

  <div className="bg-white rounded-xl shadow-sm border">


<div ref={scrollRef} className="max-h-[500px] overflow-y-auto">

  <table className="w-full text-sm text-left text-gray-600">
    <thead className="sticky top-0 bg-gray-50 z-10 text-xs uppercase">
      <tr>
        <th className="px-4 py-3">Sr.</th>
        <th className="px-4 py-3">Customer</th>
        <th className="px-4 py-3">Total</th>
        <th className="px-4 py-3">change Order Status</th>
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3">Action</th>
      </tr>
    </thead>

    <tbody>
      {filteredOrders.map((order, index) => {
        const isLast = index === filteredOrders.length - 1

        return (
          <tr
            ref={isLast ? lastRowRef : null}
            key={order._id}
            className="border-t"
          >
            <td className="px-4 py-3">{index + 1}</td>

            <td className="px-4 py-3">
              {order.user?.name}
            </td>

            <td className="px-4 py-3">
              ₹{order.totalPrice?.amount}
            </td>

            <td className="px-4 py-3">
              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(order._id, e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                <option>PENDING</option>
                <option>CONFIRMED</option>
                <option>SHIPPED</option>
                <option>DELIVERED</option>
                <option>CANCELLED</option>
              </select>
            </td>

            <td className="px-4 py-3">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>

            <td className="px-4 py-3">
              <button
                onClick={() => openModal(order)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                View
              </button>
            </td>

          </tr>
        )
      })}
    </tbody>
  </table>

</div>


  </div>

{/* 🔥 FIXED MODAL */}
{isModalOpen && selectedOrder && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

    <div className="bg-white w-full max-w-2xl mx-4 rounded-lg max-h-[90vh] flex flex-col">

      {/* HEADER */}
      <div className="sticky top-0 bg-white p-4 border-b">
        <h2 className="text-lg font-semibold text-center">
          Order Details
        </h2>
      </div>

      {/* BODY */}
      <div className="overflow-y-auto p-4 space-y-4 text-sm">

        {/* BASIC INFO */}
        <div className="space-y-1">
          <p><b>Order ID:</b> {selectedOrder._id}</p>

          <p>
            <b>Date:</b>{" "}
            {new Date(selectedOrder.createdAt).toLocaleString()}
          </p>

          <p><b>Payment:</b> {selectedOrder.paymentStatus}</p>
        </div>

        {/* CUSTOMER */}
        <div className="space-y-1">
          <p>
            <b>Name:</b>{" "}
            {selectedOrder.shippingAddress?.fullName ||
             selectedOrder.user?.name ||
             "N/A"}
          </p>

          <p>
            <b>Phone:</b>{" "}
            {selectedOrder.shippingAddress?.phone || "N/A"}
          </p>
        </div>

        {/* ADDRESS */}
        <div>
          <p><b>Address:</b></p>

          <p>
            {selectedOrder.shippingAddress?.street || ""}, <br />
            {selectedOrder.shippingAddress?.city || ""}, <br />
            {selectedOrder.shippingAddress?.state || ""} - {selectedOrder.shippingAddress?.zip || ""}, <br />
            {selectedOrder.shippingAddress?.country || ""}
          </p>
        </div>

        {/* PRODUCTS */}
        <div>
          <h3 className="font-semibold mb-2">Products</h3>

          {selectedOrder.items?.map((item, i) => (
            <div key={i} className="border p-2 rounded mb-2">
              <p className="font-medium">{item.productName}</p>
              <p>Qty: {item.quantity}</p>
              <p>₹{item.price?.amount}</p>
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <div className="border-t p-4 flex justify-between items-center">

        <p className="font-semibold">
          Total: ₹{selectedOrder.totalPrice?.amount}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => handlePrintInvoice(selectedOrder._id)}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Print
          </button>

          <button
            onClick={closeModal}
            className="bg-gray-200 px-3 py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  </div>
)}

</div>
)
}
