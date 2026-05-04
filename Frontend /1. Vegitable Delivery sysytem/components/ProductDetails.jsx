
'use client';

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Reviews from "./Reviews";


const ProductDetails = ({ product }) => {

  if (!product) return null;

  const productId = product._id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // ✅ STOCK STATES
  const isOutOfStock = (product?.stock ?? 0) <= 0;
  const isLowStock = product?.stock > 0 && product?.stock <= 5;

  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ AUTH
  const { isLoggedIn } = useSelector((state) => state.auth);

  // ✅ CART
  const cartItems = useSelector(state => state.cart.items || []);
  const loading = useSelector(state => state.cart.loading);

  const existingItem = cartItems.find(
    item => item.product?._id === productId
  );

  const [quantity, setQuantity] = useState(1);

  // ✅ Sync quantity with cart
  useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
    }
  }, [existingItem]);

  // 🔥 HANDLE ADD TO CART
  const handleCartClick = async () => {

    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login to add items");

      setTimeout(() => {
        router.push("/login");
      }, 800);

      return;
    }

    if (existingItem) {
      router.push('/cart');
      return;
    }

    try {
      await dispatch(addToCart({
        productId,
        quantity
      })).unwrap();

      toast.success(`${product.name} added to cart 🛒`);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  // ✅ IMAGES
  const images = product.images?.length
    ? product.images
    : [product.image || "/placeholder.png"];

  const [mainImage, setMainImage] = useState(images[0]);

  const isInCart = !!existingItem;

  // ✅ RATING
  const averageRating = product.rating?.length
    ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ================= IMAGES ================= */}
        <div className="flex gap-4">

          {/* THUMBNAILS */}
          <div className="flex flex-col gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setMainImage(img)}
                className={`relative w-14 h-14 cursor-pointer border rounded-md overflow-hidden ${
                  mainImage === img ? "border-green-600" : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt="thumb"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="relative w-[300px] sm:w-[350px] md:w-[400px] aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain hover:scale-105 transition duration-300"
            />
          </div>

        </div>

        {/* ================= DETAILS ================= */}
        <div>

          {/* NAME */}
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          {/* RATING */}
          <div className="flex mt-2">
            {Array(5).fill('').map((_, i) => (
              <StarIcon
                key={i}
                fill={averageRating >= i + 1 ? "#00C950" : "#ccc"}
              />
            ))}
          </div>

          {/* PRICE */}
          <p className="text-2xl text-green-600 mt-3">
            {currency}{product.price}
          </p>

          {/* STOCK STATUS */}
          {isOutOfStock && (
            <p className="text-red-500 text-sm mt-2">
              Currently unavailable
            </p>
          )}

          {!isOutOfStock && isLowStock && (
            <p className="text-orange-500 text-sm mt-1">
              Only {product.stock} left!
            </p>
          )}

          {/* DESCRIPTION */}
          <p className="mt-4 text-gray-600">
            {product.description}
          </p>

          {/* COUNTER */}
          <Counter
            quantity={quantity}
            setQuantity={setQuantity}
            disabled={isOutOfStock}
          />

          {/* BUTTON */}
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock || loading}
            className={`mt-6 px-6 py-3 rounded text-white transition ${
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
              : loading
              ? "Adding..."
              : "Add to Cart"}
          </button>

        </div>

      </div>
      <Reviews productId={product._id} />
    </div>
  );
};

export default ProductDetails;