"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
  type FieldValue,
  type Firestore,
} from "firebase/firestore";

import { useAuthGate } from "@/app/gate/auth";
import { getCategoryIcon, normalizeCategoryLabel } from "@/app/gate/categories";
import { firebaseAuthGate } from "@/app/gate/firebaseClient";
import { getDevSessionToken } from "@/app/lib/devSession";
import { getDb } from "@/app/gate/getDb";

type RestaurantRecord = Record<string, unknown> & { id?: string };

type ReviewRecord = {
  id: string;
  createdAt?: string;
  grade?: number;
  rating?: number;
  restaurantId?: string;
  text?: string;
  timestamp?: Timestamp | FieldValue | null;
  userDisplayName?: string;
  userEmail?: string;
  userId?: string;
  userPhoto?: string;
};

export const toDateValue = (review: ReviewRecord) => {
  if (review.createdAt) return new Date(review.createdAt);
  const ts = review.timestamp as Timestamp | undefined;
  if (ts && typeof ts.toDate === "function") return ts.toDate();
  return new Date(0);
};

export const parseRatingValue = (rating: unknown) => {
  if (typeof rating === "number" && !Number.isNaN(rating)) return rating;
  if (typeof rating === "string") {
    const normalized = rating.trim().replace(",", ".");
    const match = normalized.match(/-?\d+(\.\d+)?/);
    if (match) {
      const parsed = Number(match[0]);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
  }
  return 0;
};

export const getStarString = (rating: number) => {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return Array.from({ length: 5 }, (_, i) => (i < safe ? "★" : "☆")).join("");
};

export function RestaurantInfoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const db: Firestore | null = useMemo(() => getDb(), []);
  const { firebaseApp } = useMemo(() => firebaseAuthGate(), []);

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [gettoken, setGettoken] = useState<string>("");

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useAuthGate();

  useEffect(() => {
    if (!firebaseApp) return undefined;
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, [firebaseApp]);

  useEffect(() => {
    setGettoken(getDevSessionToken());
    setTokenLoaded(true);
  }, []);

  useEffect(() => {
    if (!tokenLoaded) return;
    if (!gettoken) router.replace("/");
  }, [tokenLoaded, gettoken, router]);

  useEffect(() => {
    if (!id) {
      setError("Restaurant not found.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!db) throw new Error("Firestore is not configured.");

        const restaurantRef = doc(db, "restaurants", String(id));
        const restaurantSnap = await getDoc(restaurantRef);
        if (!restaurantSnap.exists()) throw new Error("Restaurant not found.");

        const reviewQuery = query(
            collection(db, "review"),
            where("restaurantId", "==", String(id))
        );
        const reviewSnap = await getDocs(reviewQuery);

        const reviewItems = reviewSnap.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        })) as ReviewRecord[];

        reviewItems.sort((a, b) => toDateValue(b).getTime() - toDateValue(a).getTime());

        if (isMounted) {
          setRestaurant({ id: restaurantSnap.id, ...restaurantSnap.data() });
          setReviews(reviewItems);
        }
      } catch {
        if (isMounted) setError("Unable to load restaurant details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id, db]);

  const categoryList = useMemo(() => {
    if (!restaurant) return [] as string[];
    const entries = Object.entries(restaurant);
    const keys = new Set(["categories", "category", "cuisine", "cuisines"]);
    const match = entries.find(([key]) => keys.has(String(key).toLowerCase()));
    if (!match) return [];

    const [, value] = match;
    if (Array.isArray(value)) return value.map((v) => normalizeCategoryLabel(String(v))).filter(Boolean);
    if (typeof value === "string") {
      return value.split(",").map((v) => normalizeCategoryLabel(v)).filter(Boolean);
    }
    if (value) return [normalizeCategoryLabel(String(value))];
    return [];
  }, [restaurant]);

  const reviewAverage = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
        (sum, review) => sum + parseRatingValue(review.rating ?? review.grade ?? 0),
        0
    );
    return total / reviews.length;
  }, [reviews]);

  const restaurantRating = useMemo(() => {
    if (!restaurant) return 0;
    const directRating = parseRatingValue((restaurant as any).rating ?? (restaurant as any).grade ?? 0);
    return reviews.length ? reviewAverage : directRating;
  }, [restaurant, reviewAverage, reviews.length]);

  useEffect(() => {
    if (!db || !id || !restaurant) return;

    const nextStars = Number(reviewAverage.toFixed(2));
    const currentStars = parseRatingValue((restaurant as any).starsgiven ?? 0);

    if (nextStars === Number(currentStars.toFixed(2))) return;

    const restaurantRef = doc(db, "restaurants", String(id));
    updateDoc(restaurantRef, { starsgiven: nextStars })
        .then(() => setRestaurant((prev) => (prev ? { ...prev, starsgiven: nextStars } : prev)))
        .catch((err) => console.error("Failed to sync starsgiven:", err));
  }, [db, id, restaurant, reviewAverage]);

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return setSubmitError("Please sign in to leave a review.");
    if (!id) return setSubmitError("Restaurant details are missing.");
    if (!reviewText.trim()) return setSubmitError("Please add your review commentary.");
    if (!db) return setSubmitError("Firestore is not configured.");

    try {
      setSubmitting(true);
      setSubmitError("");

      const payload = {
        createdAt: new Date().toISOString(),
        grade: reviewRating,
        rating: reviewRating,
        restaurantId: String(id),
        text: reviewText.trim(),
        timestamp: serverTimestamp(),
        userDisplayName: user.displayName || "Anonymous",
        userEmail: user.email || "",
        userId: user.uid || "",
        userPhoto: user.photoURL || "",
      };

      const docRef = await addDoc(collection(db, "review"), payload);

      const newReview: ReviewRecord = {
        id: docRef.id,
        ...payload,
        timestamp: Timestamp.fromDate(new Date()),
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewText("");
      setReviewRating(0);
    } catch (err: any) {
      setSubmitError(err?.message || "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-6">Loading...</div>;
  }

  if (error || !restaurant) {
    return <div className="min-h-screen bg-black text-white p-6">{error || "Not found."}</div>;
  }

  return (
      <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold">{String((restaurant as any).name || "Restaurant")}</h1>
        <p className="text-white/70">{restaurantRating.toFixed(1)} / 5</p>

        <div className="mt-4">
          <h2 className="font-bold">Categories</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {categoryList.map((c) => (
                <span key={c} className="rounded-full border border-white/20 px-3 py-1 text-sm">
              {getCategoryIcon(c)} {c}
            </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmitReview} className="mt-6 grid gap-3 max-w-md">
          <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="rounded-xl px-3 py-2 text-black"
          >
            {[0, 1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v} star{v === 1 ? "" : "s"}
                </option>
            ))}
          </select>

          <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="rounded-xl px-3 py-2 text-black"
          />

          {submitError ? <div className="text-red-300 text-sm">{submitError}</div> : null}

          <button disabled={submitting} className="rounded-xl border border-white/20 px-4 py-2">
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="font-bold">Reviews</h2>
          <ul className="mt-2 grid gap-3">
            {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-white/10 p-3">
                  <div className="text-sm text-white/70">
                    {r.userDisplayName || "Anonymous"} • {getStarString(Number(r.rating ?? r.grade ?? 0))}
                  </div>
                  <div className="mt-1">{r.text || ""}</div>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}