"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ParticipantQR({ eventId }: { eventId: string }) {
  const { getToken } = useAuth();
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const loadQR = async () => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/attendance/qr/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (res.ok) setQr(data.qr);
    };

    loadQR();
  }, [eventId, getToken]);

  if (!qr) return <p className="text-center"><br /></p>;

  return (
    <div className="text-center">
      <img src={qr} alt="Event QR Code" className="mx-auto" />
      <p className="text-sm text-gray-500 mt-2">Show this QR at entry</p>
    </div>
  );
}
