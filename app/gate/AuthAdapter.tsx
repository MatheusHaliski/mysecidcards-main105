import type { User as FirebaseUser } from "firebase/auth";

export type AuthUser = {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
};

type GoogleCredentialPayload = {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
};

export const adaptUser = (
    user: FirebaseUser | null | undefined
): AuthUser | null => {
    if (!user) return null;
    return {
        uid: user.uid ?? "",
        displayName: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
    };
};

const parseGoogleCredentialPayload = (
    credential: string
): GoogleCredentialPayload | null => {
    if (!credential) return null;
    try {
        const payload = credential.split(".")[1];
        if (!payload) return null;
        let normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        normalized = normalized.padEnd(
            normalized.length + ((4 - (normalized.length % 4)) % 4),
            "="
        );
        const json = atob(normalized);
        return JSON.parse(json) as GoogleCredentialPayload;
    } catch {
        return null;
    }
};

export const adaptGoogleCredential = (
    credential: string | null | undefined
): AuthUser | null => {
    const payload = credential ? parseGoogleCredentialPayload(credential) : null;
    if (!payload) return null;
    return {
        uid: payload.sub ?? "",
        displayName: payload.name ?? "",
        email: payload.email ?? "",
        photoURL: payload.picture ?? "",
    };
};

export const getUserPhotoUrl = (user: AuthUser | null | undefined) => user?.photoURL ?? "";
export const getUserId = (user: AuthUser | null | undefined) => user?.uid ?? "";

export const getUserDisplayName = (user: AuthUser | null | undefined) =>
    user?.displayName ?? "";

export const getUserEmail = (user: AuthUser | null | undefined) =>
    user?.email ?? "";


export const getUserLabel = (
    user: AuthUser | null | undefined,
    fallback = "User"
) => {
    const name = getUserDisplayName(user);
    if (name) return name;
    const email = getUserEmail(user);
    if (email) return email;
    return fallback;
};
