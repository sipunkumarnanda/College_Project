
'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    // protect against division by zero if no ratings yet
    const averageRating = product.rating && product.rating.length
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
        : 0;

    const discountPercent = product.mrp ? (((product.mrp - product.price) / product.mrp) * 100).toFixed(0) : 0;
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setMainImage(product.images[index])}
                            className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer"
                            aria-hidden
                        >
                            <Image
                                src={image}
                                className="group-hover:scale-103 group-active:scale-95 transition"
                                alt={`${product.name} thumbnail ${index + 1}`}
                                width={45}
                                height={45}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        width={250}
                        height={250}
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>

                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon
                            key={index}
                            size={14}
                            className='mt-0.5'
                            fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
                        />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
                </div>

                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    {product.mrp && (
                        <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>{discountPercent}% saving today</p>
                </div>

                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }

                    <button
                        onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')}
                        className="bg-green-700 text-white px-10 py-3 text-sm font-medium rounded hover:bg-green-800 active:scale-95 transition"
                        aria-label={!cart[productId] ? 'Add to basket' : 'View cart'}
                    >
                        {!cart[productId] ? 'Add to Basket' : 'Go to Basket'}
                    </button>
                </div>

                <hr className="border-gray-300 my-5" />

                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3 items-start">
                        <EarthIcon className="text-slate-400" />
                        Free delivery on orders above {currency}499
                    </p>
                    <p className="flex gap-3 items-start">
                        <CreditCardIcon className="text-slate-400" />
                        Secure payments (UPI, Cards & Wallets)
                    </p>
                    <p className="flex gap-3 items-start">
                        <UserIcon className="text-slate-400" />
                        Sourced from trusted local farmers
                    </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails
