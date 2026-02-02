"use client";

import {JSX, useEffect, useId, useMemo, useRef, useState} from "react";
import { useRouter } from "next/navigation";
import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import {firebaseAuthGate} from "../gate/firebaseClient";
import {useAuthGate} from "@/app/gate/auth";
import {getDb} from "@/app/gate/getDb";
import {EmployeeRaw, normalizeEmployee, NormalizedEmployee} from "./UserAdapter";
firebaseAuthGate();
const hasFirebaseConfig = firebaseAuthGate();
// ============================
// ✅ Microsoft / Apple / LinkedIn tokens
// ============================
const PAGE_BG = "bg-slate-50";
const HEADER =
    "rounded-3xl border border-slate-200 bg-white";
const CARD =
    "rounded-2xl border border-slate-200/80 bg-white";
const INPUT =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300";
const PILL =
    "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700";
const BTN =
    "inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300";
const BTN_PRIMARY =
    "inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300";
const BADGE =
    "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";
const BADGE_INFO =
    "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-800";
// Dropdown UX fix: keep it ABOVE everything and never clipped by parent
const DROPDOWN =
    "absolute left-0 right-0 top-[calc(100%+10px)] z-[9999] rounded-2xl border border-slate-200 bg-white";
const DROPDOWN_ITEM =
    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-slate-900 transition hover:bg-slate-50";

const db = getDb();

function normalizeKey(value: string) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

async function getEmployees(installId: string) {
    if (!db) throw new Error("Firestore not initialized");
    if (!installId) throw new Error("Missing installId");

    const colRef = collection(db, "installids", installId, "employees");
    const q = query(colRef, orderBy("nome", "asc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({ id: d.id, ...(d.data()) })) as EmployeeRaw[];
}

// --------------------
// SearchSelect (same tags)
// --------------------
function SearchSelect<T extends string>({
                                            value,
                                            options,
                                            onChange,
                                            placeholder,
                                            searchPlaceholder,
                                            disabled,
                                            getOptionKey,
                                            getOptionLabel,
                                            includeAllOption,
                                            allLabel,
                                        }: {
    value: T;
    options: T[];
    onChange: (next: T) => void;

    placeholder: string;
    searchPlaceholder: string;

    disabled?: boolean;

    getOptionKey?: (opt: T) => string;
    getOptionLabel: (opt: T) => string;

    includeAllOption?: boolean;
    allLabel?: string;
}) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const rootRef = useRef<HTMLDivElement | null>(null);
    const searchInputId = useId();

    const hasValue = Boolean(value);
    const buttonLabel = hasValue ? getOptionLabel(value) : allLabel ?? placeholder;

    const filtered = useMemo(() => {
        const k = q.trim().toLowerCase();
        if (!k) return options;
        return options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(k));
    }, [options, q, getOptionLabel]);

    // ✅ click-outside + ESC
    useEffect(() => {
        if (!open) return;

        const onDocMouseDown = (e: MouseEvent) => {
            const el = rootRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onDocMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onDocMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    // ✅ autofocus search input
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => {
            const input = rootRef.current?.querySelector<HTMLInputElement>(
                'input[data-searchselect="1"]'
            );
            input?.focus();
        }, 0);
        return () => clearTimeout(t);
    }, [open]);

    return (
        <div ref={rootRef} className="relative ">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`${BTN} w-full justify-between ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
        <span className="text-ellipsis whitespace-nowrap">
          {buttonLabel}
        </span>
                <span className="text-slate-500">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div role="listbox" className={DROPDOWN}>
                    <div className="border-b border-slate-200 p-2.5">
                        <input
                            id={searchInputId}
                            data-searchselect="1"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={searchPlaceholder}
                            className={INPUT}
                        />
                    </div>

                    <div className="max-h-[280px] overflow-y-auto">
                        {includeAllOption ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("" as T);
                                    setOpen(false);
                                }}
                                className={`${DROPDOWN_ITEM} ${!value ? "bg-slate-50" : ""}`}
                            >
                                {allLabel ?? placeholder}
                            </button>
                        ) : null}

                        {filtered.length === 0 ? (
                            <div className="px-3 py-2.5 text-sm text-slate-500">No matches.</div>
                        ) : (
                            filtered.map((opt) => {
                                const key = getOptionKey ? getOptionKey(opt) : String(opt);
                                const selected = opt === value;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt);
                                            setOpen(false);
                                        }}
                                        className={`${DROPDOWN_ITEM} ${selected ? "bg-slate-50" : ""}`}
                                    >
                                        <span className="truncate">{getOptionLabel(opt)}</span>
                                        {selected ? <span className="text-slate-600">✓</span> : null}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default function RestaurantCardsInner(): JSX.Element | null {
    const [employees, setEmployees] = useState<EmployeeRaw[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [projectModal, setProjectModal] = useState<{
        name: string;
        projects: string[];
    } | null>(null);

    // Filters
    const [nameQuery, setNameQuery] = useState("");
    const [cargo, setCargo] = useState("");
    const [funcao, setFuncao] = useState("");
    const [regional, setRegional] = useState("");
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const user = useAuthGate();
    const authReady = useAuthGate();
    const pinCheckReady = useAuthGate();
    const hasAccess = useAuthGate();
    const authError = useAuthGate();
    const installId = "3436985B-C01A-4318-9345-9C92316F3101";

    const router = useRouter();


    // ✅ Normalize employees
    const normalized = useMemo<NormalizedEmployee[]>(() => {
        return employees.map((employee) => normalizeEmployee(employee));
    }, [employees]);

    const availableCargos = useMemo(() => {
        const s = new Set<string>();
        normalized.forEach((e) => e.cargoNormalized && s.add(e.cargoNormalized));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [normalized]);

    const availableFuncoes = useMemo(() => {
        const s = new Set<string>();
        normalized.forEach((e) => e.funcaoNormalized && s.add(e.funcaoNormalized));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [normalized]);

    const availableRegionais = useMemo(() => {
        const s = new Set<string>();
        normalized.forEach((e) => e.regionalNormalized && s.add(e.regionalNormalized));
        return Array.from(s).sort((a, b) => a.localeCompare(b));
    }, [normalized]);

    const filteredEmployees = useMemo(() => {
        const q = nameQuery.trim().toLowerCase();
        const cargoKey = normalizeKey(cargo);
        const funcaoKey = normalizeKey(funcao);
        const regionalKey = normalizeKey(regional);

        return normalized
            .filter((e) => {
                const matchesName = q ? e.name.toLowerCase().includes(q) : true;
                const matchesCargo = cargoKey
                    ? normalizeKey(e.cargoNormalized) === cargoKey
                    : true;
                const matchesFuncao = funcaoKey
                    ? normalizeKey(e.funcaoNormalized) === funcaoKey
                    : true;
                const matchesRegional = regionalKey
                    ? normalizeKey(e.regionalNormalized) === regionalKey
                    : true;
                const matchesFav = onlyFavorites ? e.favorite : true;
                return matchesName && matchesCargo && matchesFuncao && matchesRegional && matchesFav;
            })
            .sort(
                (a, b) =>
                    (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name)
            );
    }, [normalized, nameQuery, cargo, funcao, regional, onlyFavorites]);

    const total = normalized.length;
    const shown = filteredEmployees.length;
    const favCount = useMemo(() => normalized.filter((e) => e.favorite).length, [normalized]);

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

    // ✅ Gate (RETURNS aqui, nunca dentro de useEffect)
    if (!authReady || !pinCheckReady) {
        return (
            <div className={`flex min-h-screen items-center justify-center ${PAGE_BG} px-6 text-sm text-slate-600`}>
                Checking access...
            </div>
        );
    }
    if (!hasAccess) return null;

    // ✅ RETURN FINAL (obrigatório)
    return (
        <div className={`min-h-screen w-full ${PAGE_BG}`}>
            <div className="mx-auto max-w-6xl px-4 py-7 font-sans text-slate-900 sm:px-6">
                <header className={`${HEADER}  px-6 py-5`}>
                    <div className="flex flex-wrap items-start justify-between gap-8">
                        <div className="min-w-[240px]">
                            <div className="text-2xl font-semibold tracking-tight">SECID/PR - Lista de Funcionários</div>


                            <div className="mt-3 flex flex-wrap gap-2">
                <span className={PILL}>
                  <span className="text-slate-500">Total</span>
                  <span className="font-bold text-slate-900">{total}</span>
                </span>
                                <span className={PILL}>
                  <span className="text-slate-500">Showing</span>
                  <span className="font-bold text-slate-900">{shown}</span>
                </span>
                                <span className={PILL}>
                  <span className="text-slate-500">Favorites</span>
                  <span className="font-bold text-slate-900">{favCount}</span>
                </span>
                            </div>
                        </div>

                        <div className="min-w-[240px] text-right">
                            <div className="flex justify-end">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={`${user.displayName || user.email || "User"} profile`}
                                        className="h-10 w-10 rounded-2xl border border-slate-200 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600">
                                        U
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 font-semibold">
                                {user?.displayName || user?.email || "Guest"}
                            </div>

                            {authError && <div className="mt-1 text-xs text-amber-700">{authError}</div>}

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

                    <div className="mt-5 h-px w-full bg-slate-200/70" />

                    <div className="relative mt-4">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
                            <input
                                type="text"
                                value={nameQuery}
                                onChange={(e) => setNameQuery(e.target.value)}
                                placeholder="Nome"
                                className={INPUT}
                            />

                            <SearchSelect
                                value={cargo}
                                options={availableCargos as string[]}
                                onChange={setCargo}
                                placeholder="Cargo"
                                allLabel="Cargo"
                                includeAllOption
                                searchPlaceholder="Buscar cargo…"
                                getOptionLabel={(opt) => opt}
                                disabled={!availableCargos.length}
                            />

                            <SearchSelect
                                value={funcao}
                                options={availableFuncoes as string[]}
                                onChange={setFuncao}
                                placeholder="Função"
                                allLabel="Função"
                                includeAllOption
                                searchPlaceholder="Buscar função…"
                                getOptionLabel={(opt) => opt}
                                disabled={!availableFuncoes.length}
                            />

                            <SearchSelect
                                value={regional}
                                options={availableRegionais as string[]}
                                onChange={setRegional}
                                placeholder="Regional"
                                allLabel="Regional"
                                includeAllOption
                                searchPlaceholder="Buscar regional…"
                                getOptionLabel={(opt) => opt}
                                disabled={!availableRegionais.length}
                            />

                            <button
                                type="button"
                                onClick={() => setOnlyFavorites((v) => !v)}
                                className={`${BTN} justify-center`}
                                aria-pressed={onlyFavorites}
                            >
                                {onlyFavorites ? "★ Favoritos" : "☆ Favoritos"}
                            </button>

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
                    </div>
                </header>

                <section className="mt-6">
                    {loading && (
                        <div className={`${CARD} px-5 py-4 text-sm text-slate-600`}>
                            Loading employees…
                        </div>
                    )}

                    {!loading && error && (
                        <div className="whitespace-pre-wrap rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredEmployees.length === 0 && (
                        <div className={`${CARD} px-5 py-4 text-sm text-slate-600`}>
                            No employees match your filters.
                        </div>
                    )}

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
                        {filteredEmployees.map((emp) => {
                            const name = emp.name || "Sem nome";
                            const hasContacts = Boolean(
                                emp.emailNormalized || emp.celularNormalized || emp.ramalNormalized
                            );
                            const fav = Boolean(emp.favorite);

                            return (
                                <article
                                    key={emp.id}
                                    className={`${CARD} group relative p-6 min-h-[460px] min-w-[420px] transition hover:-translate-y-0.5 hover:bg-white`}
                                >

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="break-words text-xl font-semibold text-slate-900 leading-snug">
                                                    {name}
                                                </h3>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {emp.cargoNormalized ? (
                                                    <span className={BADGE}>
      💼 <span className="truncate">Cargo: {emp.cargoNormalized}</span>
    </span>
                                                ) : null}

                                                {emp.funcaoNormalized ? (
                                                    <span className={BADGE}>
      🧩 <span className="truncate">Função: {emp.funcaoNormalized}</span>
    </span>
                                                ) : null}

                                                {emp.regionalNormalized ? (
                                                    <span className={BADGE}>
      📍 <span className="truncate">Regional: {emp.regionalNormalized}</span>
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
                                                "border border-slate-300 bg-white",
                                                "transition hover:bg-slate-50 active:scale-[0.98]",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
                                            ].join(" ")}
                                            title={fav ? "Unfavorite" : "Favorite"}
                                        >
      <span className={fav ? "text-amber-500 text-2xl" : "text-slate-500 text-2xl"}>
        {fav ? "★" : "☆"}
      </span>
                                        </button>
                                    </div>

                                    {emp.projectsNormalized.length ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className={BADGE_INFO}
                                                onClick={() =>
                                                    setProjectModal({
                                                        name,
                                                        projects: emp.projectsNormalized,
                                                    })
                                                }
                                            >
                                                📌 <span className="truncate">Projetos em andamento</span>
                                            </button>
                                        </div>
                                    ) : null}


                                    {hasContacts ? (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {emp.emailNormalized ? (
                                                <span className={BADGE_INFO}>
        ✉️ <span className="truncate">E-mail: {emp.emailNormalized}</span>
      </span>
                                            ) : null}

                                            {emp.celularNormalized ? (
                                                <span className={BADGE_INFO}>
        📱 <span className="truncate">Celular: {emp.celularNormalized}</span>
      </span>
                                            ) : null}

                                            {emp.ramalNormalized ? (
                                                <span className={BADGE_INFO}>
        ☎️ <span className="truncate">Ramal: {emp.ramalNormalized}</span>
      </span>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-base text-slate-500">

                                        </div>
                                    )}


                                </article>

                            );
                        })}
                    </div>
                </section>
                {projectModal ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                        <button
                            type="button"
                            aria-label="Close projects modal"
                            onClick={() => setProjectModal(null)}
                            className="absolute inset-0 bg-slate-900/40"
                        />
                        <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900">
                                        Projetos em andamento
                                    </h4>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {projectModal.name}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setProjectModal(null)}
                                    className={BTN}
                                >
                                    Fechar
                                </button>
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {projectModal.projects.map((project, index) => (
                                    <li
                                        key={`${project}-${index}`}
                                        className="rounded-xl border border-slate-200 px-3 py-2"
                                    >
                                        {project}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
