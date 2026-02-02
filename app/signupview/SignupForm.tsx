"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { Button } from "../components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { signupSchema, type SignupValues } from "./schema";
import { firebaseAuthGate } from "@/app/gate/firebaseClient";
import { getDb } from "@/app/gate/getDb";
import { createPasswordDigest } from "@/app/lib/passwordCrypto";
import VSModal from "../components/vsmodal";

type SignupResult = {
    success: boolean;
    message: string;
};

export default function SignupForm() {
    const [result, setResult] = useState<SignupResult | null>(null);
    const [isPending, startTransition] = useTransition();
    const { hasFirebaseConfig } = useMemo(() => firebaseAuthGate(), []);
    const db = useMemo(() => getDb(), []);
    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const handleSubmit = (values: SignupValues) => {
        setResult(null);
        startTransition(async () => {
            const parsed = signupSchema.safeParse(values);
            if (!parsed.success) {
                setResult({
                    success: false,
                    message: "Please correct the highlighted fields and try again.",
                });
                return;
            }

            if (!db || !hasFirebaseConfig) {
                setResult({
                    success: false,
                    message: "Firebase is not configured for signups yet.",
                });
                return;
            }

            try {
                const normalizedEmail = parsed.data.email.trim().toLowerCase();
                const existingQuery = query(
                    collection(db, "VSusercontrol"),
                    where("email", "==", normalizedEmail)
                );
                const existingSnapshot = await getDocs(existingQuery);

                if (!existingSnapshot.empty) {
                    setResult({
                        success: false,
                        message: "An account already exists with that email address.",
                    });
                    return;
                }

                const digest = await createPasswordDigest(parsed.data.password);
                await addDoc(collection(db, "VSusercontrol"), {
                    name: parsed.data.name.trim(),
                    email: normalizedEmail,
                    passwordHash: digest.hash,
                    passwordSalt: digest.salt,
                    passwordIterations: digest.iterations,
                    passwordHashAlgorithm: digest.hashAlgorithm,
                    createdAt: new Date().toISOString(),
                });

                setResult({
                    success: true,
                    message: `Welcome, ${parsed.data.name}. Your account has been successfully created.`,
                });
                form.reset();
            } catch (error) {
                console.error("[Signup] Failed to create account", error);
                setResult({
                    success: false,
                    message: "Unable to create your account right now.",
                });
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold text-orange-500">
                                Full name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Jane Doe"
                                    {...field}
                                    className={`text-lg text-black placeholder:text-gray-400 ${
                                        form.formState.errors.name
                                            ? "border-red-500/40 ring-2 ring-red-500/30"
                                            : ""
                                    }`}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold text-orange-500">
                                Email address
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="you@example.com"
                                    type="email"
                                    {...field}
                                    className={`text-lg text-black placeholder:text-gray-400 ${
                                        form.formState.errors.email
                                            ? "border-red-500/40 ring-2 ring-red-500/30"
                                            : ""
                                    }`}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg font-semibold text-orange-500">
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Create a password"
                                    type="password"
                                    {...field}
                                    className={`text-lg text-black placeholder:text-gray-400 ${
                                        form.formState.errors.password
                                            ? "border-red-500/40 ring-2 ring-red-500/30"
                                            : ""
                                    }`}
                                />
                            </FormControl>

                            <FormDescription>
                                Use at least 8 characters with letters and numbers.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Creating your account..." : "Create your account"}
                </Button>
                {result ? (
                    <VSModal
                        message={result.message}
                        tone={result.success ? "success" : "error"}
                    />
                ) : null}
            </form>
        </Form>
    );
}