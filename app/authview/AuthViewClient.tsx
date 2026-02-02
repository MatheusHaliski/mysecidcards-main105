"use client";

import AuthShell from "../components/AuthShell";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { getDevSessionToken, setDevSessionToken } from "@/app/lib/devSession";

export default function AuthViewClient() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sessionReady, setSessionReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const t = getDevSessionToken();
        if (!t) {
            router.replace("/");
            return;
        }
        setSessionReady(true);
    }, [router]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        if (!normalizedEmail || !normalizedPassword) {
            setSubmitting(false);
            void Swal.fire({
                icon: "error",
                title: "Missing credentials",
                text: "Please enter your email and password.",
            });
            return;
        }

        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: normalizedEmail,
                    password: normalizedPassword,
                }),
            });

            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as
                    | { error?: string }
                    | null;
                void Swal.fire({
                    icon: "error",
                    title: "Access denied",
                    text:
                        data?.error ??
                        "No account was found with these credentials.",
                });
                setSubmitting(false);
                return;
            }

            const token = crypto.randomUUID();
            setDevSessionToken(token);
            router.replace("/restaurantcardspage");
        } catch (error) {
            console.error("[AuthView] Failed to verify credentials:", error);
            void Swal.fire({
                icon: "error",
                title: "Unexpected error",
                text: "Unable to verify credentials right now.",
            });
            setSubmitting(false);
        }
    };

    if (!sessionReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-sm uppercase tracking-[0.2em]">Loading...</p>
            </div>
        );
    }

    return (
        <AuthShell title="Sign In" subtitle="Welcome back">
            <form
                onSubmit={handleSubmit}
                className={[
                    "space-y-8",
                    "-translate-y-[10px]",
                    "rounded-3xl",
                    "border-amber-300 border-8",
                    "bg-transparent",
                    "p-8",
                    "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
                ].join(" ")}
            >
                <label className="text-lg font-semibold text-[#ffffff]">
                    Email Address
                    <input
                        type="email"
                        placeholder=""
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#2563eb]/40 bg-white/30 px-4 py-4 text-center text-xl text-[#2563eb] shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                    />
                </label>

                <label className="text-lg font-semibold text-[#ffffff]">
                    Password
                    <input
                        type="password"
                        placeholder=""
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#2563eb]/40 bg-white/30 px-4 py-4 text-center text-xl text-[#2563eb] shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                    />
                </label>

                <div className="mt-14 flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center scale-110 font-semibold -translate-x-[175px] -translate-y-[20px] text-xs uppercase tracking-[0.2em] text-white transition rounded-full"
                    >
                        {submitting ? "Authenticating..." : "Continue to your VS"}
                    </Button>
                </div>
            </form>

            <div
                className={[
                    "space-y-8",
                    "-translate-y-[10px]",
                    "rounded-3xl",
                    "w-150",
                    "border-amber-300 border-8",
                    "bg-transparent",
                    "p-8",
                    "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
                ].join(" ")}
            >
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => router.push("/signupview")}
                        className="inline-flex items-center scale-110 font-semibold -translate-x-[15px] text-xs uppercase tracking-[0.2em] text-white transition rounded-full"
                    >
                        Create an account
                    </Button>

                    <Button
                        type="button"
                        onClick={() => router.push("/forgetpasswordview")}
                        className="inline-flex items-center scale-110 translate-x-[15px] font-semibold text-xs uppercase tracking-[0.2em] text-white transition rounded-full"
                    >
                        Forgot Password
                    </Button>
                </div>
            </div>
        </AuthShell>
    );
}