"use client";

import { useEffect } from "react";
import { useAuthGate } from "@/app/gate/auth";
import { usePathname, useRouter } from "next/navigation";
import VSModal from "@/app/components/vsmodal";
import {
    clearDevSessionToken,
    getDevSessionToken,
    setDevSessionToken,
} from "@/app/lib/devSession";

export default function DevAuthGate() {
    const {
        googleAuthed,
        googleUserId,
        googleError,
        pinInput,
        setPinInput,
        pinVerified,
        pinError,
        pinLocked,
        verifyPin,
        resetGate
    } = useAuthGate();

    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (pathname !== "/") return;
        resetGate();
        clearDevSessionToken();
    }, [pathname, resetGate]);

    useEffect(() => {
        if (!googleAuthed || !pinVerified) return;
        const existing = getDevSessionToken();
        if (existing) {
            return
        }else{
            const token = crypto.randomUUID();
            setDevSessionToken(token);
            const existing2 = getDevSessionToken();
            console.log("TOKEN IS:",existing2);
        }
    }, [googleAuthed, pinVerified, router]);

    useEffect(() => {
        const existing = getDevSessionToken();
        if (existing) {
            router.replace("/restaurantcardspage");
        }
    }, [googleAuthed, pinVerified, router]);
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black dark:text-zinc-50">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        /gate
                    </p>
                    <h1 className="text-2xl font-semibold">Sign in with Google and enter your PIN</h1>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium">Google sign-in</p>
                        <div id="google-signin" className="mt-2 min-h-[44px]" />
                        {googleError ? (
                            <div className="mt-3">
                                <VSModal message={googleError} tone="error" />
                            </div>
                        ) : null}
                        {googleAuthed ? (
                            <div className="mt-3">
                                <VSModal message={`Signed in as ${googleUserId}`} tone="success" />
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">PIN password</label>
                        <input
                            type="password"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            placeholder="Enter your PIN"
                        />
                        {pinError ? (
                            <VSModal message={pinError} tone="error" />
                        ) : null}
                        {pinVerified ? (
                            <VSModal message="PIN verified." tone="success" />
                        ) : null}

                        <button
                            type="button"
                            onClick={verifyPin}
                            disabled={!pinInput.trim() || pinLocked}
                            className="w-full rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-zinc-50 dark:text-zinc-900"
                        >
                            Verify PIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
