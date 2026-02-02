import { getLS, removeLS, setLS } from "@/app/lib/SafeStorage";

export const DEV_SESSION_TOKEN_KEY = "devAuthToken";

export const getDevSessionToken = (): string => getLS(DEV_SESSION_TOKEN_KEY) ?? "";

export const setDevSessionToken = (token: string): void => {
    setLS(DEV_SESSION_TOKEN_KEY, token);
};

export const clearDevSessionToken = (): void => {
    removeLS(DEV_SESSION_TOKEN_KEY);
};