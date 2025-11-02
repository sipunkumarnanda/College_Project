
'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Details')

    // helper to format date in Indian locale
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
        } catch (e) {
            return dateString
        }
    }

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl" role="tablist" aria-label={`${product.name} tabs`}>
                {['Details', 'Reviews'].map((tab, index) => (
                    <button
                        key={index}
                        role="tab"
                        aria-selected={tab === selectedTab}
                        onClick={() => setSelectedTab(tab)}
                        className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold text-slate-800' : 'text-slate-400'} px-3 py-2 font-medium`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Details */}
            {selectedTab === "Details" && (
                <div className="max-w-xl space-y-4">
                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-2">
                        {product.isOrganic && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Organic</span>
                        )}
                        {product.isLocal && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Local</span>
                        )}
                        {product.freshness && (
                            <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-medium">{product.freshness}</span>
                        )}
                    </div>

                    <p className="text-slate-700">{product.description}</p>

                    {/* Optional - packed / harvest info */}
                    <div className="mt-4 text-sm text-slate-500 space-y-1">
                        {product.packedAt && (
                            <p><strong>Packed on:</strong> {formatDate(product.packedAt)}</p>
                        )}
                        {product.harvestDate && (
                            <p><strong>Harvested on:</strong> {formatDate(product.harvestDate)}</p>
                        )}
                        {product.origin && (
                            <p><strong>Source:</strong> {product.origin}</p>
                        )}
                        {/* Weight / unit */}
                        {product.unit && (
                            <p><strong>Package:</strong> {product.unit}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-6 mt-6">
                    {product.rating && product.rating.length > 0 ? (
                        product.rating.map((item, index) => (
                            <div key={index} className="flex gap-5">
                                <Image
                                    src={item.user.image}
                                    alt={`${item.user.name} avatar`}
                                    className="rounded-full"
                                    width={64}
                                    height={64}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {Array(5).fill('').map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    size={18}
                                                    className="mt-0.5"
                                                    fill={item.rating >= i + 1 ? "#00C950" : "#D1D5DB"}
                                                />
                                            ))}
                                            <p className="text-sm text-slate-600 ml-2">{item.user.name}</p>
                                        </div>
                                        <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                                    </div>

                                    <p className="text-sm text-slate-700 mt-3">{item.review}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-slate-500">
                            <p className="mb-3">No reviews yet for this product.</p>
                            <p className="text-sm">Be the first to review — your feedback helps other customers pick the freshest produce.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Store Info */}
            <div className="flex gap-3 mt-14 items-center">
                <Image
                    src={product.store.logo}
                    alt={`${product.store.name} logo`}
                    className="rounded-full ring ring-slate-200"
                    width={70}
                    height={70}
                />
                <div>
                    <p className="font-medium text-slate-600">Sold by {product.store.name}</p>
                    <p className="text-sm text-slate-500">Trusted local vendor · Fast dispatch</p>
                    <Link href={`/shop/${product.store.username}`} className="flex items-center gap-1.5 text-green-500 mt-2">
                        View store <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDescription
