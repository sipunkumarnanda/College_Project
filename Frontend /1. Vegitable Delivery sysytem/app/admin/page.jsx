
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

function decodeJWT(token) {
  try {
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const token = cookies().get("token")?.value;

  // ❌ Not logged in
  if (!token) {
    redirect("/login?error=unauthorized");
  }

  const payload = decodeJWT(token);

  // ❌ Invalid token
  if (!payload) {
    redirect("/login?error=session-expired");
  }

  // ❌ Not admin
  if (payload.role !== "admin") {
    redirect("/?error=not-admin");
  }

  // ✅ Only admin allowed
  return <AdminDashboard />;
}