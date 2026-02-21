"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import RegisterFreeEvent from "./RegisterFreeEvent";
import RegisterPaidEvent from "./RegisterPaidEvent";

export default function RegisterSection({ event }: any) {
  const { getToken } = useAuth();

  const [registered, setRegistered] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDay = new Date(event.date);
  eventDay.setHours(0, 0, 0, 0);

  // Registration closes only AFTER event day passes
  const isClosed = eventDay < today;

  const teamSize = event.eventType === "team" ? event.teamSize : 1;

  // 🔁 Initialize members
  useEffect(() => {
    setMembers(
      Array.from({ length: teamSize }, () => ({
        name: "",
        email: "",
        contact: "",
      })),
    );
  }, [teamSize]);

  // 🔍 Check registration status + user role
  useEffect(() => {
    const check = async () => {
      try {
        const token = await getToken();

        // Get user role
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const userData = await userRes.json();
        setUserRole(userData.role);

        // Get registration status
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/status/${event._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        setRegistered(data.registered);
        setIsOwner(data.owner);
      } catch {
        setRegistered(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [event._id, getToken]);

  const updateMember = (i: number, key: string, val: string) => {
    const copy = [...members];
    copy[i][key] = val;
    setMembers(copy);
  };

  const valid = members.every((m) => m.name && m.email && m.contact);

  // ❌ Cancel registration
  const cancelRegistration = async () => {
    const token = await getToken();
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/unregister/${event._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setRegistered(false);
  };

  // ⏳ LOADING STATE
  if (loading)
    return (
      <button disabled className="btn-disabled w-full">
        Checking registration...
      </button>
    );

  if (isOwner)
    return (
      <button disabled className="btn-disabled w-full">
        You own this event
      </button>
    );

  // 🚫 If user is organizer
  if (userRole === "organizer")
    return (
      <button disabled className="btn-disabled w-full">
        You are organizer
      </button>
    );

  if (isClosed)
    return (
      <button disabled className="btn-disabled w-full">
        Registration Closed
      </button>
    );

  // 🟥 CANCEL BUTTON
  if (registered)
    return (
      <button
        onClick={cancelRegistration}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-lg"
      >
        Cancel Registration
      </button>
    );

  return (
    <div className="space-y-4">
      {members.map((m, i) => (
        <div key={i} className="bg-gray-50 p-3 rounded-lg space-y-2">
          <p className="font-medium text-sm">Participant {i + 1}</p>
          <input
            placeholder="Name"
            className="input"
            onChange={(e) => updateMember(i, "name", e.target.value)}
          />
          <input
            placeholder="Email"
            className="input"
            onChange={(e) => updateMember(i, "email", e.target.value)}
          />
          <input
            placeholder="Contact No"
            className="input"
            onChange={(e) => updateMember(i, "contact", e.target.value)}
          />
        </div>
      ))}

      {event.fee === 0 ? (
        <RegisterFreeEvent
          eventId={event._id}
          members={members}
          disabled={!valid}
          onSuccess={() => setRegistered(true)}
        />
      ) : (
        <RegisterPaidEvent
          event={event}
          members={members}
          disabled={!valid}
          onSuccess={() => setRegistered(true)}
        />
      )}
    </div>
  );
}
