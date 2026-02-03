"use client";

import AuthShell from "../components/AuthShell";
import { Button } from "@/components/ui/button";

export default function SignupViewPage() {
    return (
        <AuthShell
            title="Start your Velion Social journey"
            subtitle="Create your account in minutes"
        >
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center shadow-inner backdrop-blur-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
                    Start your Velion Social journey
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-white">
                    Build your new account
                </h1>
            </div>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-6 text-center shadow-inner backdrop-blur-lg">
                <form className="space-y-5">
                    <label className="block text-center text-sm font-semibold uppercase tracking-[0.3em] text-white">
                        Full name
                        <input
                            type="text"
                            placeholder="Your full name"
                            className="mt-3 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                        />
                    </label>

                    <label className="block text-center text-sm font-semibold uppercase tracking-[0.3em] text-white">
                        Email address
                        <input
                            type="email"
                            placeholder="you@velion.com"
                            className="mt-3 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                        />
                    </label>

                    <label className="block text-center text-sm font-semibold uppercase tracking-[0.3em] text-white">
                        Password
                        <input
                            type="password"
                            placeholder="Create a password"
                            className="mt-3 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                        />
                    </label>

                    <label className="block text-center text-sm font-semibold uppercase tracking-[0.3em] text-white">
                        Confirm password
                        <input
                            type="password"
                            placeholder="Re-enter password"
                            className="mt-3 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                        />
                    </label>

                    <div className="rounded-2xl border border-amber-300/40 bg-amber-200/10 p-4 text-left text-sm text-white">
                        <div className="flex items-start gap-3">
                            <input
                                id="data-policy"
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-white/40 bg-transparent text-amber-300 focus:ring-2 focus:ring-amber-300/60"
                            />
                            <label htmlFor="data-policy" className="space-y-2">
                                <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                                    Important
                                </span>
                                <span className="block">
                                    By continuing, you confirm that you agree with our data use policy and
                                    advertising updates.
                                </span>
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-xs font-semibold uppercase tracking-[0.3em]"
                    >
                        Create your account
                    </Button>
                </form>
            </div>
        </AuthShell>
    );
}
