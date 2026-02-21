"use client";

import { useAuth } from "@clerk/nextjs";

type Props = {
  eventId: string;
  members: {
    name: string;
    email: string;
    contact: string;
  }[];
  disabled: boolean;
  onSuccess: () => void;
};

export default function RegisterFreeEvent({
  eventId,
  members,
  disabled,
  onSuccess,
}: Props) {
  const { getToken } = useAuth();

  const handleRegister = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/free`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, members }),
    });

    if (!res.ok) return alert("Registration failed");
    onSuccess();
  };
  const btn =
"w-full py-3 rounded-lg text-white font-semibold text-lg " +
"bg-gradient-to-r from-blue-500 to-green-500 " +
"hover:from-blue-600 hover:to-green-600 transition-all shadow-lg disabled:opacity-50";

  return (
    <button
      disabled={disabled}
      onClick={handleRegister}
      className={btn}
    >
      Register
    </button>
  );
}
