"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

type StatusType = "none" | "pending" | "approved" | "rejected" | null;

export default function AdminRequestCard() {
  const [status, setStatus] = useState<StatusType>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // 🔹 Load current admin request status
  const loadStatus = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        console.error("No Clerk token found");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch status");

      const data = await res.json();
      setStatus(data.adminRequest ?? "none");
    } catch (err) {
      console.error("LOAD STATUS ERROR:", err);
      setStatus("none");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // 🔹 Request admin access
  const handleRequest = async () => {
    try {
      const token = await getToken();

      if (!token) {
        alert("Authentication error. Please login again.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/request-admin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setStatus("pending");
    } catch (err: any) {
      console.error("ADMIN REQUEST ERROR:", err);
      alert(err.message);
    }
  };

  if (loading) return null;
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

        {/* APPROVED */}
        {status === "approved" && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
            ✅ You are an Admin 👑
          </div>
        )}

        {/* PENDING */}
        {status === "pending" && (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
            ⏳ Your admin request is under review
          </div>
        )}

        {/* REJECTED */}
        {status === "rejected" && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
            ❌ Your admin request was rejected
          </div>
        )}

        {/* REQUEST BUTTON */}
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