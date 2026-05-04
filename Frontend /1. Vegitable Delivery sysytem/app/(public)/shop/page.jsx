
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

import api from "@/lib/api";
import { addToCart } from "@/lib/features/cart/cartSlice";

const ShopPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const search = searchParams.get("search"); // ✅ GET SEARCH PARAM

  const { items: cartItems = [] } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const observer = useRef();

  // =========================
  // ✅ FETCH PRODUCTS WITH SEARCH
  // =========================
  const fetchProducts = async (pageNumber, searchQuery) => {
    try {
      setLoading(true);

      let url = `/products?page=${pageNumber}&limit=10`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      console.log("API CALL:", url); // 🔍 DEBUG

      const res = await api.get(url);
      const newProducts = res.data.data;

      setProducts((prev) => {
        const combined =
          pageNumber === 1 ? newProducts : [...prev, ...newProducts];

        const unique = Array.from(
          new Map(combined.map((item) => [item._id, item])).values()
        );

        return unique;
      });

      setHasMore(newProducts.length === 10);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ RESET WHEN SEARCH CHANGES
  // =========================
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search]);

  // =========================
  // ✅ FETCH ON PAGE OR SEARCH
  // =========================
  useEffect(() => {
    fetchProducts(page, search);
  }, [page, search]);

  // =========================
  // ✅ INFINITE SCROLL
  // =========================
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // =========================
  // ✅ ADD TO CART
  // =========================
  const handleCartClick = async (e, product, isInCart) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please login to add items");
      router.push("/login");
      return;
    }

    if (isInCart) {
      router.push("/cart");
      return;
    }

    try {
      setAddingId(product._id);

      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      toast.success(`${product.name} added to cart 🛒`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* TITLE */}
      <div className="mb-6 flex items-center gap-2 text-sm text-blue-600">
  <Search size={16} />
  <span>
    {search ? `Search results for "${search}"` : "All products"}
  </span>
</div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const isInCart = cartItems.some(
            (item) => item.product?._id === product._id
          );

          const imageUrl = product?.image || "";
          const isLast = index === products.length - 1;
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={`${product._id}-${index}`}
              ref={isLast ? lastProductRef : null}
              className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
            >
              <Link href={`/product/${product._id}`}>
                <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {isOutOfStock && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                      Out of Stock
                    </span>
                  )}

                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      No Image
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="font-semibold text-green-600 mt-1">
                    ₹{product.price}
                  </p>
                </div>
              </Link>

              {/* BUTTON */}
              <button
                onClick={(e) =>
                  handleCartClick(e, product, isInCart)
                }
                disabled={isOutOfStock || addingId === product._id}
                className={`mt-3 w-full py-2 rounded text-white transition ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : isInCart
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : isInCart
                  ? "Go to Cart"
                  : addingId === product._id
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>

      {/* NO RESULTS */}
      {!loading && products.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-gray-500 mb-3">
            No results found for "{search}"
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            View all products
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-center mt-6 text-gray-500">
          Loading more products...
        </p>
      )}

      {/* END */}
      {!hasMore && products.length > 0 && (
        <p className="text-center mt-6 text-gray-400">
          No more products
        </p>
      )}
    </div>
  );
};

export default ShopPage;