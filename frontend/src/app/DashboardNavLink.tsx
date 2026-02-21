"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

type UserType = {
  role: "participant" | "organizer" | "admin";
};

export default function DashboardNavLink() {
  const { getToken } = useAuth();
  const [user, setUser] = useState<UserType | null | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, [getToken]);

  // 🔹 While loading → don't render link (prevents wrong redirect)
  if (user === undefined) return null;

  // 🔹 If error → hide dashboard link
  if (user === null) return null;

  let dashboardPath = "/dashboard/participant";

  if (user.role === "organizer") {
    dashboardPath = "/dashboard/organizer";
  } else if (user.role === "admin") {
    dashboardPath = "/dashboard/admin";
  }

  return (
    <Link
      href={dashboardPath}
      className="relative group transition"
    >
      Dashboard
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}