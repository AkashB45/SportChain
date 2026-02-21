"use client";

import dynamic from "next/dynamic";

// Disable SSR completely for this page
const VerifyComponent = dynamic(() => Promise.resolve(VerifyPage), {
  ssr: false,
});

export default function Page() {
  return <VerifyComponent />;
}

import { useState } from "react";

function VerifyPage() {
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const verifyCertificate = async () => {
    if (!hash.trim() || loading) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/verify/${hash.trim()}`,
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Verification failed");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-20 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black">
            Certificate Verification
          </h1>
          <p className="text-gray-600 mt-3">
            Verify blockchain-issued SportChain certificates instantly.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter IPFS Certificate Hash (Qm...)"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              autoComplete="off"
              className="flex-1 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-black"
            />

            <button
              onClick={verifyCertificate}
              disabled={loading}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center font-medium">
              ❌ {error}
            </div>
          )}

          {/* Success */}
          {data && (
            <div className="mt-10 space-y-8">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-5 rounded-2xl text-center font-semibold text-lg">
                ✅ Certificate Successfully Verified
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard label="Participant" value={data.participant} />
                <InfoCard label="Event" value={data.event} />
                <InfoCard label="Sport" value={data.sport} />
                <InfoCard label="Category" value={data.category} />
                <InfoCard label="Venue" value={data.venue} />

                <InfoCard
                  label="Position"
                  value={data.position}
                  highlight={data.position !== "PARTICIPANT"}
                />
              </div>

              {/* Blockchain Hash Box */}
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
                <p className="text-gray-600 text-sm mb-2 font-medium">
                  Blockchain Verification Hash
                </p>
                <p className="text-blue-700 font-mono break-all text-sm">
                  {data.certificateHash}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:shadow-md transition">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p
        className={`text-lg font-semibold ${
          highlight ? "text-blue-700" : "text-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
