"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getDevSessionToken } from "@/app/lib/devSession";
import RestaurantCardsInner from "./RestaurantCardsInner";

export default function RestaurantCardsPage() {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const existing = getDevSessionToken();
    if (!existing) {
      router.replace("/");
      return;
    }
    setSessionReady(true);
  }, [router]);

  if (!sessionReady) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <p className="text-sm uppercase tracking-[0.2em]">Loading...</p>
        </div>
    );
  }

  return <RestaurantCardsInner />;
}