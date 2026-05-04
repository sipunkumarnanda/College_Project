
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import BestSelling from "@/components/BestSelling";
import LatestProducts from "@/components/LatestProducts";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search"); // ✅ NEW

  useEffect(() => {
    const error = searchParams.get("error");

    if (!error) return;

    if (error === "not-vendor") {
      toast.error("Only vendors can access the store dashboard");
    }

    router.replace("/");
  }, []);

  return (
    <div>
      <Hero />
      <LatestProducts search={search} /> {/* ✅ PASS */}
      <BestSelling search={search} />
      <OurSpecs />
      <Newsletter />
    </div>
  );
}