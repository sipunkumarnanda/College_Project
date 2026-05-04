
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import api from "@/lib/api";
import toast from "react-hot-toast";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/${id}`);
        const data = res.data?.data || null;

        if (!data) {
          toast.error("Product not found");
        }

        setProduct(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // ⏳ LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ❌ ERROR STATE
  // =========================
  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500">
            Product not found
          </p>

          <p className="text-sm text-gray-500 mt-2">
            This product may have been removed or does not exist.
          </p>

          <button
            onClick={() => router.push("/shop")}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ✅ MAIN PRODUCT UI
  // =========================
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;