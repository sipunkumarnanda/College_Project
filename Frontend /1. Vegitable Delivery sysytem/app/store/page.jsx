
import { cookies } from "next/headers";
import DashboardClient from "@/components/store/DashboardClient";

async function getVendor() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      {
        headers: {
          Cookie: `token=${cookies().get("token")?.value}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export default async function StorePage() {
  const token = cookies().get("token")?.value;

  const user = token ? await getVendor() : null;

  return <DashboardClient user={user} />;
}