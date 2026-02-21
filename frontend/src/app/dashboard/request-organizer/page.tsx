"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestOrganizer() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<any>(null);

  const loadStatus = async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/my-organizer-request`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequest(await res.json());
  };

  useEffect(() => { loadStatus(); }, []);

  const submit = async () => {
    if (!form.organizationName || !form.description || !form.photo || !form.idProof) {
      return alert("Please fill all fields and upload required documents.");
    }

    setLoading(true);
    const token = await getToken();
    const data = new FormData();
    data.append("organizationName", form.organizationName);
    data.append("description", form.description);
    data.append("photo", form.photo);
    data.append("idProof", form.idProof);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/request-organizer`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    if (!res.ok) alert((await res.json()).message);
    await loadStatus();
    setLoading(false);
  };

  // 🟡 Pending
  if (request?.status === "pending")
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center w-[420px]">
          <div className="text-yellow-500 text-5xl mb-4">🕒</div>
          <h2 className="text-xl font-semibold mb-2">Request Under Review</h2>
          <p className="text-gray-600 text-sm">Our admin team is reviewing your organizer request.</p>
          <button
            onClick={async () => {
              const token = await getToken();
              await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/cancel-organizer-request`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              loadStatus();
            }}
            className="mt-6 text-red-600 font-medium hover:underline"
          >
            Cancel Request
          </button>
        </div>
      </div>
    );

  // 🟢 Approved (Wallet step)
  if (request?.status === "approved" && !request?.verified)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center w-[420px]">
          <div className="text-green-500 text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold mb-2">Approval Granted!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Connect your MetaMask wallet to complete blockchain verification.
          </p>
          <button
            onClick={() => router.push("/organizer/wallet")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );

  // 🔵 Verified
  if (request?.verified)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center w-[420px]">
          <div className="text-blue-500 text-5xl mb-4">✅</div>
          <h2 className="text-xl font-semibold mb-2">You’re a Verified Organizer</h2>
          <button
            onClick={() => router.push("/dashboard/organizer")}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );

  // 📝 Application Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Organizer Application</h2>

        {/* Organization Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Organization Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter organization name"
            onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe your organization and events"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Upload Photo */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Organizer Photo</label>
          <input
            type="file"
            className="w-full text-sm border rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setForm({ ...form, photo: e.target.files![0] })}
          />
        </div>

        {/* Upload ID Proof */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Government ID Proof</label>
          <input
            type="file"
            className="w-full text-sm border rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setForm({ ...form, idProof: e.target.files![0] })}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
