"use client";

import {
  getStarRating,
  getCountryFlagPng,
  parseRatingValue,
} from "@/app/gate/restaurantpagegate";

import { TEXT_GLOW, FILTER_GLOW_LINE, CARD_GLASS } from "@/app/lib/uiToken";
import {useEffect} from "react";

/* ======================
   TYPES
====================== */
type Review = {
  id: string;
  rating?: number;
  grade?: number;
  text?: string;
  userDisplayName?: string;
  userPhoto?: string;
  createdAt?: string;
};

type Restaurant = {
  id: string;
  name?: string;
  photo?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  categories?: string[];
  rating?: number;
  starsgiven?: number;
};

/* ======================
   PROPS
====================== */
type Props = {
  restaurant: Restaurant;
  reviews: Review[];
};

/* ======================
   COMPONENT
====================== */
export default function RestaurantInfoFront({ restaurant, reviews }: Props) {
  const countryName = restaurant.country ?? "";
  const flag = getCountryFlagPng(countryName);

  const ratingValue = parseRatingValue(restaurant.starsgiven ?? restaurant.rating ?? 0);

  const { rounded, display } = getStarRating(ratingValue);

  const locationLine = [
    restaurant.address,
    restaurant.city,
    restaurant.state,
    restaurant.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ===== HEADER ===== */}
        <header
          className={[
            "relative overflow-hidden rounded-3xl border border-white/18",
            "bg-white/[0.06] backdrop-blur-2xl mb-6",
            FILTER_GLOW_LINE,
          ].join(" ")}
        >
          <div className="relative grid gap-6 p-6 md:grid-cols-[300px_1fr]">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/12 bg-white/5">
              {restaurant.photo ? (
                <img
                  src={restaurant.photo}
                  alt={restaurant.name ?? "Restaurant"}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div>
              <h1 className={`text-3xl font-extrabold ${TEXT_GLOW}`}>{restaurant.name}</h1>

              <div className="mt-3 flex items-center gap-3">
                {flag && (
                  <img
                    src={flag.src}
                    alt={flag.alt}
                    className="h-6 w-9 rounded-md ring-1 ring-white/20"
                  />
                )}
                <span className="font-semibold">{locationLine}</span>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/18 bg-white/[0.10] px-4 py-2">
                <span className="text-amber-400 font-bold text-lg">{"★".repeat(rounded)}</span>
                <span className="text-sm text-white/70">{display.toFixed(1)} / 5</span>
              </div>
            </div>
          </div>
        </header>

        {/* ===== REVIEWS ===== */}
        <section className={`${CARD_GLASS} p-6`}>
          <h2 className={`text-xl font-extrabold ${TEXT_GLOW}`}>Reviews</h2>

          {reviews.length === 0 ? (
            <p className="mt-4 text-white/70">No reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-white/12 bg-white/[0.06] p-4"
                >
                  <div className="flex items-center gap-3">
                    {review.userPhoto && (
                      <img
                        src={review.userPhoto}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold">
                        {review.userDisplayName ?? "Anonymous"}
                      </div>
                      <div className="text-amber-400 text-sm">
                        {"★".repeat(
                          Math.round(parseRatingValue(review.rating ?? review.grade ?? 0))
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-white/80">{review.text ?? "No comment"}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
