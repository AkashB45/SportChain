"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { connectWallet } from "@/lib/wallet";

export default function OrganizerWallet() {
  const { getToken } = useAuth();

  const [wallet, setWallet] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    if ((window as any).ethereum) setStep(1);
    else setStep(0);
  }, []);

  // -----------------------------
  // STEP 1 — CONNECT WALLET
  // -----------------------------
  const connect = async () => {
    const address = await connectWallet();
    if (!address) return;

    setWallet(address);
    setStep(2);

    const token = await getToken();

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/wallet`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: address }),
    });
  };

  // -----------------------------
  // STEP 2 — VERIFY ON BLOCKCHAIN
  // -----------------------------
  const verify = async () => {
    setLoading(true);
    const token = await getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/verify-wallet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: wallet }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      setLoading(false);
      return;
    }

    setVerified(true);
    setStep(3);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[480px]">
        <h2 className="text-2xl font-semibold mb-4">
          Organizer Blockchain Verification
        </h2>

        {/* ❌ NO METAMASK */}
        {step === 0 && (
          <>
            <p className="text-red-600 mb-3">
              MetaMask extension not detected.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
            >
              Install MetaMask →
            </a>
          </>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p className="mb-4">
              Step 1: Connect your Ethereum wallet to continue.
            </p>
            <button
              onClick={connect}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Connect MetaMask
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && wallet && !verified && (
          <>
            <p className="mb-2">
              Wallet Connected:
              <span className="block font-mono text-sm text-gray-600">
                {wallet}
              </span>
            </p>

            <p className="mb-4">
              Step 2: Verify your organizer identity on blockchain.
            </p>

            <button
              disabled={loading}
              onClick={verify}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify on Blockchain"}
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && verified && (
          <>
            <p className="text-green-600 font-semibold mb-3">
              🎉 Organizer successfully verified on blockchain!
            </p>

            <p className="text-sm text-gray-600">
              Your wallet & cryptographic hash are now anchored on Ethereum.
              You can start creating verified sports events.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
