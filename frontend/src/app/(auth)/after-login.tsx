"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function AfterLoginSync() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const syncUser = async () => {
      const token = await getToken();

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    };

    syncUser();
  }, [isSignedIn]);

  return null;
}
