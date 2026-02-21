"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ParticipantQR from "./ParticipantQR";
import OrganizerScanner from "./OrganizerScanner";

export default function EventQRSection({
  event,
  organizerId,
}: {
  event: any;
  organizerId: string;
}) {
  const { getToken } = useAuth();

  const [role, setRole] = useState<string | null>(null);
  const [clerkUserId, setClerkUserId] = useState<string | null>(null);
  const [userId, setUserId] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      // console.log("USER DATA", data);
      setUserId(data.id);
      setRole(data.role);
      setClerkUserId(data.clerkUserId);
    };

    fetchUser();
  }, [getToken]);

  // Only show QR on event day
  const today = new Date().toDateString();
  const eventDay = new Date(event.date).toDateString();
  if (today !== eventDay) return null;

  // ✅ Participant QR
  if (role === "participant") {
    return <ParticipantQR eventId={event._id} />;
  }

  // console.log(organizerId, userId, role);
  // 🔐 Organizer Scanner (Extra Validation)
  if (
    role === "organizer" &&
    organizerId === userId
  ) {
    return <OrganizerScanner eventId={event._id} />;
  }

  return null;
}
