"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminApprovalPanel({ currentUser }: any) {
  const [requests, setRequests] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, adminRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/requests`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/all-admins`, { credentials: "include" }),
      ]);

      setRequests(await reqRes.json());
      setAdmins(await adminRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/${action}/${id}`, {
      method: "POST",
      credentials: "include",
    });
    fetchData();
  };

  const removeAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove admin access?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/remove-admin/${id}`, {
      method: "PATCH",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) alert(data.message);
    fetchData();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium animate-pulse text-gray-600">
          Loading Admin Control Center...
        </p>
      </div>
    );

  const filteredAdmins = admins.filter((a) =>
    (a.name || a.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            🛡 Admin Control Center
          </h1>

          {/* NEW BUTTON */}
          <button
            onClick={() => router.push("/admin/organizers")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 font-semibold"
          >
            Manage Organizers →
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search admins by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <span className="absolute left-4 top-4 text-gray-400">🔎</span>
        </div>

        {/* CURRENT ADMINS */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Admins</h2>

          {filteredAdmins.length === 0 && (
            <p className="text-gray-500">No admins found</p>
          )}

          <div className="divide-y">
            {filteredAdmins.map((admin) => (
              <div
                key={admin._id}
                className="flex justify-between items-center py-4 hover:bg-gray-50 px-2 rounded-lg transition"
              >
                <span className="font-medium text-gray-700">
                  {admin.name || admin.email}
                </span>
                <button
                  onClick={() => removeAdmin(admin._id)}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition ${
                    admin._id === currentUser.id
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {admin._id === currentUser.id ? "Remove My Access" : "Remove Admin"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PENDING REQUESTS */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Pending Admin Requests
          </h2>

          {requests.length === 0 && (
            <p className="text-gray-500">No pending requests</p>
          )}

          <div className="divide-y">
            {requests.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center py-4 hover:bg-gray-50 px-2 rounded-lg transition"
              >
                <span className="font-medium text-gray-700">
                  {user.name || user.email}
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleAction(user._id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(user._id, "reject")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
