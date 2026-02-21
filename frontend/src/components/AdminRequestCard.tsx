"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function AdminRequestCard() {
  const [status, setStatus] = useState<
    "none" | "pending" | "approved" | "rejected" | null
  >(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const loadStatus = async () => {
      const token = await getToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStatus(data.adminRequest);
    };

    loadStatus();
  }, []);

  const handleRequest = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/request-admin`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) setStatus("pending");
    else alert(data.message);
  };

  if (status === null) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 bg-white border border-gray-100">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="text-4xl">🛡️</div>
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Access Control
          </h2>
        </div>

        {/* STATUS STATES */}
        {status === "approved" && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
            ✅ You are an Admin 👑
          </div>
        )}

        {status === "pending" && (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
            ⏳ Your admin request is under review
          </div>
        )}

        {status === "rejected" && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
            ❌ Your admin request was rejected
          </div>
        )}

        {(status === "none" || status === "rejected") && (
          <>
            <p className="text-gray-600 text-sm mt-4 mb-6">
              Request elevated privileges to help manage organizers, approvals,
              and platform administration.
            </p>

            <button
              onClick={handleRequest}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              🚀 Request Admin Access
            </button>
          </>
        )}
      </div>
    </div>
  );
}
