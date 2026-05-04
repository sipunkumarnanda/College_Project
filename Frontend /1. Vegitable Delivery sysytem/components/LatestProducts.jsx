
"use client";

import React, { useEffect } from "react";
import Title from "./Title";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useRouter } from "next/navigation";

const LatestProducts = ({ search }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const displayQuantity = 4;

  const {
    items: products = [],
    loading,
    error,
  } = useSelector((state) => state.product || {});

  useEffect(() => {
    dispatch(fetchProducts({ search }));
  }, [dispatch, search]);

  const sortedProducts = products
    ?.slice()
    ?.sort((a, b) => {
      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    })
    ?.slice(0, displayQuantity);

  return (
    <div className="px-6 my-24 max-w-7xl mx-auto">
      <Title
        title={
          search
            ? `Search Results for "${search}"`
            : "Freshly Arrived Vegetables"
        }
        description={`Showing ${
          products.length < displayQuantity ? products.length : displayQuantity
        } of ${products.length} items`}
        href="/shop"
      />

      {loading && <p className="mt-6 text-gray-500">Loading...</p>}
      {error && <p className="mt-6 text-red-500">Error: {error}</p>}

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {sortedProducts?.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          !loading && (
            <div className="text-center col-span-full mt-6">
              <p className="text-gray-500 mb-3">
                {search
                  ? `No results found for "${search}"`
                  : "No products available"}
              </p>

              {search && (
                <button
                  onClick={() => router.push("/shop")}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  View all products
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LatestProducts;