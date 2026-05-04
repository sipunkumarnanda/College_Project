
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import api from "@/lib/api";

export default function StoreManageProducts() {
const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);

const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const observer = useRef();

const [showModal, setShowModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

const [formData, setFormData] = useState({
name: "",
price: "",
description: "",
stock: "",
image: "",
});

// ✅ FETCH PRODUCTS WITH PAGINATION
const fetchProducts = async (pageNumber = 1) => {
try {
const res = await api.get(
`/vendor/products?page=${pageNumber}&limit=10`
);

  if (res.data.success) {
    const newProducts = res.data.data;

    setProducts((prev) =>
      pageNumber === 1 ? newProducts : [...prev, ...newProducts]
    );

    if (newProducts.length < 10) {
      setHasMore(false);
    }
  }
} catch {
  toast.error("Failed to load products");
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchProducts(page);
}, [page]);

// ✅ INFINITE SCROLL
const lastRowRef = useCallback(
(node) => {
if (loading) return;

  if (observer.current) observer.current.disconnect();

  observer.current = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      setPage((prev) => prev + 1);
    }
  });

  if (node) observer.current.observe(node);
},
[loading, hasMore]

);

// ✅ TOGGLE STOCK
const toggleStock = async (id) => {
try {
const res = await api.put(`/products/${id}/toggle-stock`);

  setProducts((prev) =>
    prev.map((p) => (p._id === id ? res.data.data : p))
  );

  toast.success("Stock updated");
} catch {
  toast.error("Error updating stock");
}

};

// ✅ OPEN MODAL
const openEditModal = (product) => {
setSelectedProduct(product);
setFormData({
name: product.name,
price: product.price,
description: product.description || "",
stock: product.stock,
image: product.image || "",
});
setShowModal(true);
};

// ✅ INPUT CHANGE
const handleChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

// ✅ UPDATE PRODUCT
const updateProduct = async () => {
try {
const res = await api.put(
`/products/${selectedProduct._id}`,
formData
);

  setProducts((prev) =>
    prev.map((p) =>
      p._id === selectedProduct._id
        ? res.data.data || res.data
        : p
    )
  );

  toast.success("Product updated");
  setShowModal(false);
} catch (err) {
  toast.error(err.response?.data?.message || "Update failed");
}

};

if (loading && products.length === 0) return <Loading />;

return (
<> <h1 className="text-2xl text-slate-500 mb-6">
Manage{" "} <span className="text-slate-800 font-semibold">
Products </span> </h1>


  {/* TABLE */}
  <div className="bg-white rounded-xl shadow-sm border">
    <div className="max-h-[500px] overflow-y-auto">

      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-slate-50 text-gray-600 uppercase text-xs z-10">
          <tr>
            <th className="px-5 py-4 text-left">Name</th>
            <th className="px-5 py-4 hidden md:table-cell text-left">
              Description
            </th>
            <th className="px-5 py-4 hidden md:table-cell text-left">
              MRP
            </th>
            <th className="px-5 py-4 text-left">Price</th>
            <th className="px-5 py-4 text-center">Stock</th>
            <th className="px-5 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => {
            const isLast = index === products.length - 1;

            return (
              <tr
                ref={isLast ? lastRowRef : null}
                key={product._id}
                className="border-t hover:bg-slate-50 transition"
              >
                {/* NAME */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image}
                      alt=""
                      width={45}
                      height={45}
                      className="rounded-md border"
                    />
                    <span className="font-medium text-slate-700">
                      {product.name}
                    </span>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="px-5 py-4 hidden md:table-cell text-slate-500 truncate max-w-xs">
                  {product.description}
                </td>

                {/* MRP */}
                <td className="px-5 py-4 hidden md:table-cell">
                  {currency} {product.mrp || product.price}
                </td>

                {/* PRICE */}
                <td className="px-5 py-4 font-medium">
                  {currency} {product.price}
                </td>

                {/* STOCK */}
                <td className="px-5 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-xs font-semibold ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={product.stock > 0}
                        onChange={() =>
                          toast.promise(
                            toggleStock(product._id),
                            { loading: "Updating..." }
                          )
                        }
                      />

                      <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>

                      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                    </label>
                  </div>
                </td>

                {/* ACTION */}
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => openEditModal(product)}
                    className="px-4 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* LOADING */}
      {loading && (
        <p className="text-center py-3 text-gray-500">
          Loading more products...
        </p>
      )}

      {!hasMore && (
        <p className="text-center py-3 text-gray-400">
          No more products
        </p>
      )}
    </div>
  </div>

  {/* MODAL */}
  {showModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Edit Product
        </h2>

        <div className="flex flex-col gap-4">
          <input name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded" />
          <input name="price" type="number" value={formData.price} onChange={handleChange} className="border p-2 rounded" />
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 rounded" />
          <input name="image" value={formData.image} onChange={handleChange} className="border p-2 rounded" />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={updateProduct} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )}
</>


);
}
