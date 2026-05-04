
'use client'

import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import api from "@/lib/api"

export default function StoreAddProduct() {

const categories = [
'Fruits',
'Leafy Vegetables',
'Root Vegetables',
'Fruiting Vegetables',
'Flower Vegetables',
'Seed Vegetables',
'Stem Vegetables',
'Tuber Vegetables',
'Gourds & Melons',
'Herbs & Greens',
'Organic Vegetables'
];

// ✅ ONLY ONE IMAGE
const [image, setImage] = useState(null)

const [productInfo, setProductInfo] = useState({
name: "",
description: "",
mrp: "",
price: "",
category: "",
stock: "",
})

const [loading, setLoading] = useState(false)
const [imageMode, setImageMode] = useState("upload")
const [imageUrl, setImageUrl] = useState("")

const onChangeHandler = (e) => {
setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
}

const onSubmitHandler = async () => {
setLoading(true)

try {
  const formData = new FormData()

  formData.append("name", productInfo.name)
  formData.append("description", productInfo.description)
  formData.append("price", productInfo.price)
  formData.append("category", productInfo.category)
  formData.append("stock", productInfo.stock)

  // ✅ IMAGE LOGIC
  if (imageMode === "upload" && image) {
    formData.append("image", image)
  } else if (imageMode === "url" && imageUrl) {
    formData.append("image", imageUrl)
  } else {
    toast.error("Please add product image")
    setLoading(false)
    return
  }

  const res = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  if (res.data.success) {
    toast.success("Product added successfully")

    // reset
    setProductInfo({
      name: "",
      description: "",
      mrp: "",
      price: "",
      category: "",
      stock: "",
    })

    setImage(null)
    setImageUrl("")
    setImageMode("upload")
  }

} catch (err) {
  toast.error(err.response?.data?.message || "Failed to add product")
} finally {
  setLoading(false)
}

}

return (
<form
onSubmit={(e) => {
e.preventDefault()
toast.promise(onSubmitHandler(), {
loading: "Adding Product..."
})
}}
className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow border mb-28"
>

  <h1 className="text-2xl font-semibold text-slate-700">
    Add New <span className="text-green-600">Product</span>
  </h1>

  {/* IMAGE */}
  <div className="mt-6">
    <p className="font-medium text-slate-600 mb-2">Product Image</p>

    <div className="flex gap-3 mb-4">
      <button type="button"
        onClick={() => setImageMode("upload")}
        className={`px-4 py-1 rounded ${imageMode === "upload" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
        Upload
      </button>

      <button type="button"
        onClick={() => setImageMode("url")}
        className={`px-4 py-1 rounded ${imageMode === "url" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
        Image URL
      </button>
    </div>

    {/* UPLOAD */}
    {imageMode === "upload" && (
      <div>
        <label htmlFor="imageUpload">
          <Image
            width={120}
            height={120}
            className="h-28 w-28 object-cover border rounded-lg cursor-pointer hover:scale-105 transition"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt=""
          />
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
        </label>
      </div>
    )}

    {/* URL */}
    {imageMode === "url" && (
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {imageUrl && (
          <img src={imageUrl} className="w-28 h-28 border rounded object-cover" />
        )}
      </div>
    )}
  </div>

  {/* NAME */}
  <div className="mt-6">
    <label className="text-sm font-medium text-slate-600">Product Name</label>
    <input
      type="text"
      name="name"
      value={productInfo.name}
      onChange={onChangeHandler}
      className="w-full mt-1 p-3 border rounded-lg"
      required
    />
  </div>

  {/* DESCRIPTION */}
  <div className="mt-6">
    <label className="text-sm font-medium text-slate-600">Description</label>
    <textarea
      name="description"
      value={productInfo.description}
      onChange={onChangeHandler}
      className="w-full mt-1 p-3 border rounded-lg"
      rows={4}
      required
    />
  </div>

  {/* PRICE + STOCK */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
    <input type="number" name="mrp" placeholder="MRP" value={productInfo.mrp} onChange={onChangeHandler} className="p-3 border rounded-lg" />
    <input type="number" name="price" placeholder="Price" value={productInfo.price} onChange={onChangeHandler} className="p-3 border rounded-lg" required />
    <input type="number" name="stock" placeholder="Stock" value={productInfo.stock} onChange={onChangeHandler} className="p-3 border rounded-lg" required />
  </div>

  {/* CATEGORY */}
  <select
    value={productInfo.category}
    onChange={(e) => setProductInfo({ ...productInfo, category: e.target.value })}
    className="w-full mt-6 p-3 border rounded-lg"
    required
  >
    <option value="">Select category</option>
    {categories.map(cat => (
      <option key={cat}>{cat}</option>
    ))}
  </select>

  {/* BUTTON */}
  <button
    disabled={loading}
    className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
  >
    {loading ? "Adding..." : "Add Product"}
  </button>

</form>

)
}
