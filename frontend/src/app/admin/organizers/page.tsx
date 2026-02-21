"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AdminOrganizers() {
  const { getToken } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/organizers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    setPending(data.pending || []);
    setApproved(data.approved || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/organizers/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const reject = async (id: string) => {
    const token = await getToken();
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/organizers/${id}/reject`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  const renderFile = (url: string) => {
    if (!url) return null;
    const isPdf = url.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 font-semibold hover:underline"
        >
          📄 View Document
        </a>
      );
    }

    return (
      <img
        src={url}
        className="w-28 h-28 rounded-xl object-cover border shadow-sm"
        alt="Organizer file"
      />
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-lg font-medium animate-pulse text-gray-600">
          Loading Organizer Verification Panel...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            🏟 Organizer Verification Panel
          </h1>
          <p className="text-gray-500 mt-2">
            Review, approve, or remove event organizers
          </p>
        </div>

        {/* ---------------- Pending Requests ---------------- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              ⏳ Pending Requests
            </h2>
            <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
              {pending.length} Pending
            </span>
          </div>

          {pending.length === 0 && (
            <div className="bg-white rounded-xl shadow p-6 text-gray-500">
              No pending organizer requests.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pending.map((o) => (
              <div
                key={o._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {o.organizationName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{o.description}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Pending
                  </span>
                </div>

                {/* FILE PREVIEWS */}
                <div className="flex gap-6 mt-5 items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Photo</p>
                    {renderFile(o.photo)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID Proof</p>
                    {renderFile(o.idProof)}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => approve(o._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(o._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Approved Organizers ---------------- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              ✅ Approved Organizers
            </h2>
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
              {approved.length} Approved
            </span>
          </div>

          {approved.length === 0 && (
            <div className="bg-white rounded-xl shadow p-6 text-gray-500">
              No approved organizers yet.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {approved.map((o) => (
              <div
                key={o._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {o.organizationName}
                    </h3>
                    <p className="text-sm text-gray-500">{o.user?.email}</p>
                    <p className="text-gray-600 text-sm mt-1">{o.description}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Approved
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-gray-500 mb-1">Organizer Photo</p>
                  {renderFile(o.photo)}
                </div>

                <button
                  onClick={() => reject(o._id)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Remove Organizer
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
