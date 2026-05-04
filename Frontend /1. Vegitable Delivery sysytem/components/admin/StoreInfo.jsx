
"use client";

import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";

const StoreInfo = ({ store }) => {
  // ✅ fallback safe values
  const logo = store?.store?.image || "/placeholder.png";
  const storeName = store?.store?.name || store?.name;
  const username = store?.store?.username || store?.email;
  const description =
    store?.store?.description || "No description available";
  const address = store?.store?.address || "No address";
  const contact = store?.store?.contact || "No contact";

  // ✅ NEW: correct status values
  const approvalStatus = store?.store?.status || "pending"; // approved / pending
  const isActive = store?.isActive;

  return (
    <div className="flex-1 space-y-2 text-sm">
      <Image
        width={100}
        height={100}
        src={logo}
        alt={storeName}
        className="max-w-20 max-h-20 object-contain shadow rounded-full"
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center">

        <h3 className="text-xl font-semibold text-slate-800">
          {storeName}
        </h3>

        <span className="text-sm">@{username}</span>

        {/* ✅ APPROVAL STATUS */}
        <span
          className={`text-xs font-semibold px-4 py-1 rounded-full ${
            approvalStatus === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {approvalStatus}
        </span>

        {/* ✅ ACTIVE STATUS */}
        <span
          className={`text-xs font-semibold px-4 py-1 rounded-full ${
            isActive
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "active" : "inactive"}
        </span>

      </div>

      <p className="text-slate-600 my-3 max-w-2xl">
        {description}
      </p>

      <p className="flex items-center gap-2">
        <MapPin size={16} /> {address}
      </p>

      <p className="flex items-center gap-2">
        <Phone size={16} /> {contact}
      </p>

      <p className="flex items-center gap-2">
        <Mail size={16} /> {store.email}
      </p>

      <p className="text-slate-700 mt-3">
        Applied on{" "}
        <span className="text-xs">
          {new Date(store.createdAt).toLocaleDateString()}
        </span>
      </p>
    </div>
  );
};

export default StoreInfo;