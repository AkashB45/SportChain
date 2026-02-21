"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "@clerk/nextjs";

export default function OrganizerScanner({ eventId }: { eventId: string }) {
  const { getToken } = useAuth();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "info">("info");
  const [flash, setFlash] = useState(false);

  // Start scanner AFTER UI renders
  useEffect(() => {
    if (!scanning) return;
    
    const start = async () => {
      scannerRef.current = new Html5Qrcode("reader");

      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },

          async (decodedText) => {
            const token = await getToken();

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/attendance/scan`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: decodedText, eventId }),
              }
            );

            const data = await res.json();

            setMessage(data.message);
            setStatus(res.ok ? "success" : "error");

            // 🎉 Flash animation trigger
            setFlash(true);
            setTimeout(() => setFlash(false), 800);
          },

          () => {}
        );
      } catch (err) {
        console.error("Camera start failed", err);
        setMessage("Camera access failed");
        setStatus("error");
      }
    };

    start();

    return () => {
      stopScanner();
    };
  }, [scanning]);

  const startScanner = () => setScanning(true);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
  if (!message) return;

  const timer = setTimeout(() => {
    setMessage("");
    setStatus("info");
  }, 3000); // message visible for 3 seconds

  return () => clearTimeout(timer);
}, [message]);


  return (
    <div className="flex flex-col items-center space-y-4 mt-6">
      {!scanning ? (
        <button
          onClick={startScanner}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg shadow"
        >
          🎥 Start Scanner
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-lg shadow"
        >
          ❌ Stop Scanner
        </button>
      )}

      {/* Scanner Box ONLY when scanning */}
      {scanning && (
        <div
          className={`relative w-full max-w-md border-4 rounded-xl overflow-hidden shadow-lg transition-all duration-300
            ${flash ? "border-green-400 shadow-green-400/50 scale-105" : "border-blue-500"}`}
        >
          <div id="reader" className="w-full" />

          {/* Animated Scan Line */}
          <div className="absolute inset-0 flex items-start pointer-events-none">
            <div className="w-full h-1 bg-green-400 animate-scanline opacity-80" />
          </div>
        </div>
      )}

      {/* Result Message */}
      {message && (
        <div
          className={`px-4 py-2 rounded-lg text-white text-center w-full max-w-md transition-all duration-300 animate-fadeIn
            ${
              status === "success"
                ? "bg-green-600"
                : status === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
