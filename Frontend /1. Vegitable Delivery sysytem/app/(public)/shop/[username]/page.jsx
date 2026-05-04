
'use client'

import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import { dummyStoreData, productDummyData } from "@/assets/assets"

export default function StoreShop() {

const { username } = useParams()

const [products, setProducts] = useState([])
const [storeInfo, setStoreInfo] = useState(null)
const [loading, setLoading] = useState(true)

const fetchStoreData = async () => {
setStoreInfo(dummyStoreData)


// ✅ FIX: normalize product structure properly
const fixedProducts = productDummyData.map((p) => ({
  _id: p._id || p.id, // MUST exist
  name: p.name,
  price: p.price,
  image: p.image || p.images?.[0] || "/placeholder.png",
}))

console.log("FIXED PRODUCTS:", fixedProducts) // 🔍 debug

setProducts(fixedProducts)
setLoading(false)


}

useEffect(() => {
fetchStoreData()
}, [])

return !loading ? ( <div className="min-h-[70vh] mx-6">

  {/* Store Info */}
  {storeInfo && (
    <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
      <Image
        src={storeInfo.logo}
        alt={storeInfo.name}
        width={200}
        height={200}
        className="size-32 object-cover rounded-md"
      />
      <div>
        <h1 className="text-3xl font-semibold">{storeInfo.name}</h1>
        <p className="text-sm mt-2">{storeInfo.description}</p>

        <div className="mt-4 text-sm space-y-2">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2" />
            {storeInfo.address}
          </div>
          <div className="flex items-center">
            <MailIcon className="w-4 h-4 mr-2" />
            {storeInfo.email}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Products */}
  <div className="max-w-7xl mx-auto mb-40">
    <h1 className="text-2xl mt-12">
      Shop <span className="font-medium">Products</span>
    </h1>

    <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </div>

</div>

) : <Loading />
}
