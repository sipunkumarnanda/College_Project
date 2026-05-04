
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/");
    }, 1000);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Page not found. Redirecting...</p>
    </div>
  );
}