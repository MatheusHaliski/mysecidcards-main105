"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { getDb } from "@/app/gate/getDb";
import RestaurantInfoFront from "@/app/restaurantinfopage/[id]/RestaurantInfoFront";
import { getDevSessionToken } from "@/app/lib/devSession";

type RestaurantRecord = Record<string, unknown> & { id: string };

type ReviewRecord = Record<string, unknown> & { id: string };

export default function Page() {
  const params = useParams();
  const id = useMemo(() => {
    const value = params?.id;
    return Array.isArray(value) ? value[0] : value;
  }, [params]);

  const db = useMemo(() => getDb(), []);
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const existing = getDevSessionToken();
    if (!existing) router.replace("/");
  }, [router]);

  useEffect(() => {
    if (!id) {
      setError("Restaurant not found.");
      setLoading(false);
      return;
    }

    if (!db) {
      setError("Firestore not configured.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const restaurantRef = doc(db, "restaurants", id);
        const restaurantSnap = await getDoc(restaurantRef);

        if (!restaurantSnap.exists()) {
          if (isMounted) {
            setRestaurant(null);
            setError("Restaurant not found.");
          }
          return;
        }

        const restaurantData = {
          id: restaurantSnap.id,
          ...restaurantSnap.data(),
        } as RestaurantRecord;

        const reviewQuery = query(
            collection(db, "review"),
            where("restaurantId", "==", id)
        );

        const reviewSnap = await getDocs(reviewQuery);
        const reviewItems = reviewSnap.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        })) as ReviewRecord[];

        if (isMounted) {
          setRestaurant(restaurantData);
          setReviews(reviewItems);
        }
      } catch (err) {
        console.error("[RestaurantInfoPage] load failed:", err);
        if (isMounted) setError("Unable to load restaurant details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [db, id]);

  if (loading) {
    return <div className="text-white p-6">Loading restaurant…</div>;
  }

  if (error) {
    return <div className="text-white p-6">{error}</div>;
  }

  if (!restaurant) {
    return <div className="text-white p-6">Restaurant not found.</div>;
  }

  return <RestaurantInfoFront restaurant={restaurant} reviews={reviews} />;
}