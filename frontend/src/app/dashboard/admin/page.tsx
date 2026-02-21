"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import AdminRequestCard from "@/components/AdminRequestCard";
import AdminApprovalPanel from "@/components/AdminApprovalPanel";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, [getToken]);

  if (user === undefined) return <p>Loading...</p>;
  if (user === null) return <p>Error loading user</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {user.role === "admin" ? <AdminApprovalPanel currentUser={user}/> : <AdminRequestCard />}
    </div>
  );
}
