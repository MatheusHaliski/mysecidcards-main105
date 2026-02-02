"use client";
import AuthShell from "../components/AuthShell";
import SignupForm from "./SignupForm";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "../components/ui/button";
import {getDevSessionToken} from "@/app/lib/devSession";

export default function SignupViewPage() {
    const router = useRouter();
    const [tokenLoaded, setTokenLoaded] = useState(false);
    const [token, get_token] = useState<string>("");

    useEffect(() => {
        // ✅ roda só no client
        get_token(getDevSessionToken());
        setTokenLoaded(true);
    }, []);

    useEffect(() => {
        if (!tokenLoaded) return;
        if (!token) router.replace("/");
    }, [tokenLoaded, token, router]);

    return (
        <AuthShell title="Sign up" subtitle="Start your Velion Social journey">
            <SignupForm />
            <div className="flex flex-col items-center gap-3 text-base text-[#1d4ed8]/80">
                <p className="flex items-center gap-2 text-[#1d4ed8] font-semibold">
                    <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.593c.75 1.334-.213 2.998-1.742 2.998H3.48c-1.53 0-2.492-1.664-1.743-2.998L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-7a1 1 0 00-.993.883L9 8v3a1 1 0 001.993.117L11 11V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    IMPORTANT
                </p>
                <p className="max-w-md text-center text-base text-[#1d4ed8]/75"> By creating an account, you agree to our community guidelines and data use policy. </p>
            </div>
        </AuthShell>
    );
}