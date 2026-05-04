
'use client';

import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import {
fetchCart,
removeFromCart,
updateCartQuantity
} from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Cart() {

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

const dispatch = useDispatch();

const { items: cartItems = [], loading, error } = useSelector(
state => state.cart
);

useEffect(() => {
dispatch(fetchCart());
}, [dispatch]);

const totalPrice = cartItems.reduce((total, item) => {
return total + (item.product?.price || 0) * item.quantity;
}, 0);

const handleRemove = async (productId) => {
if (!productId) return;

try {
  await dispatch(removeFromCart(productId)).unwrap();
  toast.success("Item removed from cart 🗑️");
} catch (err) {
  toast.error("Failed to remove item");
}

};

const handleQuantityChange = (productId, quantity) => {
if (!productId || quantity < 1) return;

dispatch(updateCartQuantity({ productId, quantity }));

};

if (loading) return <div className="p-10 text-center">Loading...</div>;
if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

return cartItems.length > 0 ? ( <div className="min-h-screen mx-6 text-slate-800">

  <div className="max-w-7xl mx-auto">
    <PageTitle
      heading="My Cart"
      text="items in your cart"
      linkText="Add more"
    />

    <div className="flex items-start justify-between gap-5 max-lg:flex-col">

      <table className="w-full max-w-4xl text-slate-600 table-auto">
        <thead>
          <tr>
            <th className="text-left">Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product?._id || item._id}>

              {/* PRODUCT */}
              <td className="flex gap-3 my-4">
                <Image
                  src={item.product?.image || "/placeholder.png"}
                  alt={item.product?.name || "Product"}
                  width={45}
                  height={45}
                />
                <div>
                  <p>{item.product?.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.product?.category}
                  </p>
                  <p>
                    {currency}{item.product?.price}
                  </p>
                </div>
              </td>

              {/* QUANTITY */}
              <td className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product?._id,
                        item.quantity - 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product?._id,
                        item.quantity + 1
                      )
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </td>

              {/* TOTAL */}
              <td className="text-center">
                {currency}
                {(item.product?.price * item.quantity).toLocaleString()}
              </td>

              {/* REMOVE */}
              <td className="text-center">
                <button
                  onClick={() => handleRemove(item.product?._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2Icon size={18} />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* SUMMARY */}
      <OrderSummary totalPrice={totalPrice} items={cartItems} />

    </div>
  </div>
</div>

) : ( <div className="min-h-[80vh] flex items-center justify-center"> <h1 className="text-lg text-slate-500">Your cart is empty</h1> </div>
);
}
