
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateStore() {
const router = useRouter();

const [loading, setLoading] = useState(true);
const [submitted, setSubmitted] = useState(false);
const [status, setStatus] = useState("");
const [message, setMessage] = useState("");

const [form, setForm] = useState({
name: "",
description: "",
contact: "",
address: "",
pincode: "",
area: "",
image: null,
});

// ✅ HANDLE INPUT
const handleChange = (e) => {
setForm((prev) => ({
...prev,
[e.target.name]: e.target.value,
}));
};

// ✅ AUTH CHECK
useEffect(() => {
const checkAuth = async () => {
try {
await api.get("/auth/me");
setLoading(false);
} catch {
toast.error("Login required to register store");
router.push("/login?redirect=/create-store");
}
};


checkAuth();


}, []);

// ✅ SUBMIT
const handleSubmit = async () => {
try {
if (!form.name || !form.contact || !form.address || !form.area) {
throw new Error("Please fill required fields");
}


  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("contact", form.contact);
  formData.append("address", form.address);
  formData.append("pincode", form.pincode);
  formData.append("area", form.area);

  if (form.image) {
    formData.append("image", form.image);
  }

  const res = await api.post("/vendor/register", formData);

  setSubmitted(true);
  setStatus(res.data.status);
  setMessage(res.data.message);
} catch (err) {
  console.error(err);

  throw new Error(
    err.response?.data?.message ||
    err.message ||
    "Something went wrong"
  );
}


};

if (loading) return <Loading />;

return ( <div className="min-h-screen bg-gray-50 py-10 px-4">
{!submitted ? ( <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">


      <h1 className="text-2xl font-semibold mb-6 text-center">
        Register Store 🏪
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(handleSubmit(), {
            loading: "Submitting...",
            success: "Store submitted!",
            error: (err) => err.message,
          });
        }}
        className="space-y-5"
      >

        {/* IMAGE */}
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            <div className="w-32 h-32 border-2 border-dashed flex items-center justify-center rounded-lg overflow-hidden">
              {form.image ? (
                <Image
                  src={URL.createObjectURL(form.image)}
                  alt="preview"
                  width={120}
                  height={120}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  Upload Logo
                </span>
              )}
            </div>

            <input
              type="file"
              hidden
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.files[0],
                }))
              }
            />
          </label>
        </div>

        {/* INPUTS */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            placeholder="Store Name"
            value={form.name}
            onChange={handleChange}
            className="input"
          />

          <input
            name="contact"
            placeholder="Contact"
            value={form.contact}
            onChange={handleChange}
            className="input"
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="input"
          />

          {/* 🔥 AREA SELECT */}
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Area</option>
            <option value="Baripada">Baripada</option>
            <option value="Bombeychok">Bombeychok</option>
            <option value="Bangiriposi">Bangiriposi</option>
            <option value="Rairangpur">Rairangpur</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input md:col-span-2"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="input md:col-span-2"
          />
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded">
          Submit Store
        </button>

      </form>
    </div>
  ) : (
    <div className="text-center mt-20">
      <h2 className="text-green-600 text-xl">{message}</h2>
      <p>Status: {status}</p>
    </div>
  )}
</div>


);
}
