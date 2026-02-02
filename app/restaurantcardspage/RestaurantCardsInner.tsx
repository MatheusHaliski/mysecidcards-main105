"use client";

import {JSX, useEffect, useId, useMemo, useRef, useState} from "react";
import { useRouter } from "next/navigation";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import {
    adaptUser,
    type AuthUser, getUserDisplayName, getUserEmail,
    getUserLabel,
    getUserPhotoUrl,
} from "@/app/authview/AuthAdapter";
import {firebaseAuthGate} from "../gate/firebaseClient";
import {useAuthGate} from "@/app/gate/auth";
import {getDb} from "@/app/gate/getDb";
import {SearchSelect} from "@/app/restaurantcardspage/selectelement";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
const firebaseApp= firebaseAuthGate();
const hasFirebaseConfig = firebaseAuthGate();
// ============================
// ✅ Microsoft / Apple / LinkedIn tokens
// ============================
const PAGE_BG = "bg-[#ccd99c]";
const HEADER =
    "rounded-3xl border-2 border-black bg-white shadow-[0_14px_40px_rgba(0,0,0,0.18)] text-black";
const CARD =
    "rounded-3xl border-2 border-black bg-white backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] text-black";
const INPUT =
    "h-12 w-full rounded-xl border-2 border-black bg-white px-3 text-black placeholder:text-neutral-500 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40";
const PILL =
    "inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold text-black shadow-sm";
const BTN =
    "inline-flex h-12 items-center justify-center rounded-xl border-2 border-black bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:bg-neutral-100 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40";
const BTN_PRIMARY =
    "inline-flex h-12 items-center justify-center rounded-xl border-2 border-black bg-black px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-900 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40";
const BADGE =
    "inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-semibold text-black shadow-sm transition hover:bg-neutral-100";
const BADGE_INFO =
    "inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-medium text-black";
// Dropdown UX fix: keep it ABOVE everything and never clipped by parent
const DROPDOWN =
    "absolute left-0 right-0 top-[calc(100%+10px)] z-[9999] rounded-2xl border-2 border-black bg-white shadow-2xl";
const DROPDOWN_ITEM =
    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-black transition hover:bg-neutral-100";

const db = getDb();

// ============================
// ✅ Firestore schema (employees)
// ============================
type Employee = {
    id: string;

    cargo?: string;
    celular?: string;
    displayName?: string;
    email?: string;
    favorito?: boolean;
    funcao?: string;
    nome?: string;
    projetos?: string;
    ramal?: string;
    regional?: string;
    uuid?: string;
};



function normalizeKey(value: string) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function safeStr(v: unknown) {
    return typeof v === "string" ? v.trim() : "";
}


async function getEmployees(installId: string) {
    if (!db) throw new Error("Firestore not initialized");
    if (!installId) throw new Error("Missing installId");

    const colRef = collection(db, "installids", "3436985B-C01A-4318-9345-9C92316F3101", "employees");
    const q = query(colRef, orderBy("nome", "asc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({ id: d.id, ...(d.data()) })) as Employee[];
}

export default function RestaurantCardsInner(): JSX.Element | null {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { firebaseApp, hasFirebaseConfig } = firebaseAuthGate();
    // Filters
    const [nameQuery, setNameQuery] = useState("");
    const [cargo, setCargo] = useState("");
    const [funcao, setFuncao] = useState("");
    const [regional, setRegional] = useState("");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authError, setAuthError] = useState("");
    const authReady = useAuthGate();
    const pinCheckReady = useAuthGate();
    const hasAccess = useAuthGate();
    const installId = "3436985B-C01A-4318-9345-9C92316F3101";

    const router = useRouter();


    // ✅ Normalize employees
    const normalized = useMemo(() => {
        return employees.map((e) => {
            const name = safeStr(e.nome) || safeStr(e.displayName) || "";
            return {
                ...e,
                _name: name,
                _cargo: safeStr(e.cargo),
                _funcao: safeStr(e.funcao),
                _regional: safeStr(e.regional),
                _email: safeStr(e.email),
                _celular: safeStr(e.celular),
                _ramal: safeStr(e.ramal),
                _projetos: safeStr(e.projetos),
                _fav: Boolean(e.favorito),
            };
        });
    }, [employees]);

    const availableCargos = useMemo(() => {
        const s = new Set<string>();
        normalized.forEach((e) => e._cargo && s.add(e._cargo));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [normalized]);

    const availableFuncoes = useMemo(() => {
        const s = new Set<string>();
        normalized.forEach((e) => e._funcao && s.add(e._funcao));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [normalized]);

    const availableRegionais = useMemo(() => {
        const s = new Set<string>();
        normalized.forEach((e) => e._regional && s.add(e._regional));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [normalized]);

    const filteredEmployees = useMemo(() => {
        const q = nameQuery.trim().toLowerCase();
        const cargoKey = normalizeKey(cargo);
        const funcaoKey = normalizeKey(funcao);
        const regionalKey = normalizeKey(regional);

        return normalized
            .filter((e) => {
                const matchesName = q ? e._name.toLowerCase().includes(q) : true;
                const matchesCargo = cargoKey ? normalizeKey(e._cargo) === cargoKey : true;
                const matchesFuncao = funcaoKey ? normalizeKey(e._funcao) === funcaoKey : true;
                const matchesRegional = regionalKey ? normalizeKey(e._regional) === regionalKey : true;
                const matchesFav = onlyFavorites ? e._fav : true;
                return matchesName && matchesCargo && matchesFuncao && matchesRegional && matchesFav;
            })
            .sort(
                (a, b) =>
                    (b._fav ? 1 : 0) - (a._fav ? 1 : 0) || a._name.localeCompare(b._name)
            );
    }, [normalized, nameQuery, cargo, funcao, regional, onlyFavorites]);

    const total = normalized.length;
    const shown = filteredEmployees.length;
    const favCount = useMemo(() => normalized.filter((e) => e._fav).length, [normalized]);

    // ✅ Load employees (NUNCA JSX aqui)
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                if (!hasFirebaseConfig) {
                    if (alive) {
                        setError(
                            "Firebase config is missing. Check .env.local (NEXT_PUBLIC_FIREBASE_*) and restart `npm run dev`."
                        );
                    }
                    return;
                }

                // Se quiser, pode fazer: if (!hasAccess) return;
                const items = await getEmployees(installId);
                if (alive) setEmployees(items);
            } catch (e) {
                console.error("[Secidcardspage] load failed:", e);
                if (alive) setError("Failed to load employees.");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [installId]);

    // ✅ Toggle favorite (fora do useEffect)
    const toggleFavorite = async (empId: string, nextValue: boolean) => {
        setEmployees((prev) =>
            prev.map((e) => (e.id === empId ? { ...e, favorito: nextValue } : e))
        );

        try {
            if (!db) throw new Error("Firestore not initialized");

            await updateDoc(doc(db, "installids", installId, "employees", empId), {
                favorito: nextValue,
            });
        } catch (e) {
            setEmployees((prev) =>
                prev.map((e) => (e.id === empId ? { ...e, favorito: !nextValue } : e))
            );
            console.error("[Secidcardspage] Failed to toggle favorite:", e);
        }
    };

    useEffect(() => {
        if (!firebaseApp) return undefined;
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
            setUser(adaptUser(nextUser));
        });
        return () => unsubscribe();
    }, [firebaseApp]);

    const handleSignOut = async () => {
        if (!firebaseApp) {
            setAuthError("Firebase auth is not configured.");
            return;
        }

        try {
            await signOut(getAuth(firebaseApp));
            setAuthError("");
        } catch (signOutError) {
            console.error("[RestaurantCardsPage] sign out failed:", signOutError);
            setAuthError("Failed to sign out.");
        }
    };
    // ✅ Gate (RETURNS aqui, nunca dentro de useEffect)
    if (!authReady || !pinCheckReady) {
        return (
            <div className={`flex min-h-screen items-center justify-center ${PAGE_BG} px-6 text-sm text-neutral-200`}>
                Checking access...
            </div>
        );
    }
    if (!hasAccess) return null;

    // ✅ RETURN FINAL (obrigatório)
    return (
        <div className={`min-h-screen w-full ${PAGE_BG}`}>
            <div className="mx-auto max-w-6xl px-4 py-7 font-sans text-black sm:px-6">
                <header className={`${HEADER}  px-6 py-5`}>
                    <div className="flex flex-wrap items-start justify-between gap-8">
                        <div className="min-w-[240px]">
                            <div className="text-2xl font-semibold tracking-tight">SECID/PR - Lista de Funcionários</div>


                            <div className="mt-3 flex flex-wrap gap-2">
                <span className={PILL}>
                  <span className="text-neutral-600">Total</span>
                  <span className="font-bold text-black">{total}</span>
                </span>
                                <span className={PILL}>
                  <span className="text-neutral-600">Showing</span>
                  <span className="font-bold text-black">{shown}</span>
                </span>
                                <span className={PILL}>
                  <span className="text-neutral-600">Favorites</span>
                  <span className="font-bold text-black">{favCount}</span>
                </span>
                            </div>
                        </div>

                        <div className="min-w-[240px] text-right">
                            <div className="flex justify-end">
                                {getUserPhotoUrl(user)? (
                                    <img
                                        src={getUserPhotoUrl(user)}
                                        alt={`${getUserDisplayName(user) ||getUserEmail(user) || "User"} profile`}
                                        className="h-10 w-10 rounded-2xl border-2 border-black object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black bg-white text-sm font-bold text-black">
                                        U
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 font-semibold">
                                {user?.displayName || user?.email || "Guest"}
                            </div>

                            {authError && <div className="mt-1 text-xs text-black">{authError}</div>}

                            <div className="mt-3 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.replace("/");
                                        queueMicrotask(() => handleSignOut());
                                    }}
                                    className={BTN}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 h-px w-full bg-black" />

                    <div className="relative mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                            <input
                                type="text"
                                value={nameQuery}
                                onChange={(e) => setNameQuery(e.target.value)}
                                placeholder="Search by name…"
                                className={INPUT}
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    setNameQuery("");
                                    setCargo("");
                                    setFuncao("");
                                    setRegional("");
                                    setOnlyFavorites(false);
                                }}
                                className={BTN_PRIMARY}
                            >
                                Clear
                            </button>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
                            <SearchSelect
                                value={cargo}
                                options={availableCargos as string[]}
                                onChange={setCargo}
                                placeholder="All cargos"
                                allLabel="All cargos"
                                includeAllOption
                                searchPlaceholder="Search cargo…"
                                getOptionLabel={(opt) => opt}
                                disabled={!availableCargos.length}
                            />

                            <SearchSelect
                                value={funcao}
                                options={availableFuncoes as string[]}
                                onChange={setFuncao}
                                placeholder="All functions"
                                allLabel="All functions"
                                includeAllOption
                                searchPlaceholder="Search function…"
                                getOptionLabel={(opt) => opt}
                                disabled={!availableFuncoes.length}
                            />

                            <SearchSelect
                                value={regional}
                                options={availableRegionais as string[]}
                                onChange={setRegional}
                                placeholder="All regionals"
                                allLabel="All regionals"
                                includeAllOption
                                searchPlaceholder="Search regional…"
                                getOptionLabel={(opt) => opt}
                                disabled={!availableRegionais.length}
                            />

                            <button
                                type="button"
                                onClick={() => setOnlyFavorites((v) => !v)}
                                className={`${BTN} justify-center`}
                                aria-pressed={onlyFavorites}
                            >
                                {onlyFavorites ? "★ Favorites" : "☆ Favorites"}
                            </button>
                        </div>
                    </div>
                </header>

                <section className="mt-6">
                    {loading && (
                        <div className={`${CARD} px-5 py-4 text-sm text-black`}>
                            Loading employees…
                        </div>
                    )}

                    {!loading && error && (
                        <div className="whitespace-pre-wrap rounded-2xl border-2 border-black bg-white px-5 py-4 text-sm font-semibold text-black">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredEmployees.length === 0 && (
                        <div className={`${CARD} px-5 py-4 text-sm text-black`}>
                            No employees match your filters.
                        </div>
                    )}

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
                        {filteredEmployees.map((emp) => {
                            const name = emp._name || "Sem nome";
                            const titleLine =
                                [emp._cargo, emp._funcao].filter(Boolean).join(" • ") || "—";
                            const hasContacts = Boolean(emp._email || emp._celular || emp._ramal);
                            const metaLine = emp._regional ? `📍 ${emp._regional}` : "";
                            const fav = Boolean(emp._fav);

                            return (
                                <article
                                    key={emp.id}
                                    className={`${CARD} group relative p-5 min-h-[360px] min-w-[370px] transition hover:-translate-y-0.5 hover:bg-neutral-100`}
                                >

                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-black/40 to-transparent" />

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="break-words text-xl font-semibold text-black leading-snug">
                                                    {name}
                                                </h3>
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-2 -translate-y-[-20px]">
                                                {emp._cargo ? (
                                                    <span className={BADGE}>
      💼 <span className="truncate">Cargo: {emp._cargo}</span>
    </span>
                                                ) : null}

                                                {emp._funcao ? (
                                                    <span className={BADGE}>
      🧩 <span className="truncate">Função: {emp._funcao}</span>
    </span>
                                                ) : null}

                                                {emp._regional ? (
                                                    <span className={BADGE}>
      📍 <span className="truncate">Regional: {emp._regional}</span>
    </span>
                                                ) : null}
                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(emp.id, !fav)}
                                            aria-label={fav ? "Unfavorite" : "Favorite"}
                                            className={[
                                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                                                "border-2 border-black bg-white shadow-sm",
                                                "transition hover:bg-neutral-100 active:scale-[0.98]",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
                                            ].join(" ")}
                                            title={fav ? "Unfavorite" : "Favorite"}
                                        >
      <span className={fav ? "text-black text-2xl" : "text-neutral-500 text-2xl"}>
        {fav ? "★" : "☆"}
      </span>
                                        </button>
                                    </div>

                                    {emp._projetos ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
    <span className={BADGE_INFO}>
      📌 <span className="truncate">{emp._projetos}</span>
    </span>
                                        </div>
                                    ) : null}


                                    {hasContacts ? (
                                        <div className="mt-4 translate-y-4.5 flex flex-wrap gap-3">
                                            {emp._email ? (
                                                <span className={BADGE_INFO}>
        ✉️ <span className="truncate">E-mail: {emp._email}</span>
      </span>
                                            ) : null}

                                            {emp._celular ? (
                                                <span className={BADGE_INFO}>
        📱 <span className="truncate">Celular: {emp._celular}</span>
      </span>
                                            ) : null}

                                            {emp._ramal ? (
                                                <span className={BADGE_INFO}>
        ☎️ <span className="truncate">Ramal: {emp._ramal}</span>
      </span>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-base text-neutral-600">

                                        </div>
                                    )}


                                </article>

                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
