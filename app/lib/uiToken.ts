// src/app/gate/uiTokens.ts
export const GLASS = "border-2 border-black bg-white";

export const GLASS_DEEP = "border-2 border-black bg-white backdrop-blur-2xl";

export const FILTER_GLOW_BAR =
    "bg-white shadow-[0_0_0_2px_rgba(0,0,0,1),0_12px_40px_rgba(0,0,0,0.18)]";

export const FILTER_GLOW_LINE =
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(800px_200px_at_50%_0%,rgba(0,0,0,0.25),transparent_55%)]";

export const GLOW_BAR =
    "bg-gradient-to-r from-black via-neutral-700 to-black " +
    "shadow-[0_14px_45px_rgba(0,0,0,0.25)]";

export const GLOW_LINE =
    "after:content-[''] after:absolute after:left-6 after:right-6 after:-bottom-2 " +
    "after:h-[10px] after:rounded-full after:bg-gradient-to-r after:from-black/40 after:via-neutral-500/40 after:to-black/40 " +
    "after:blur-xl";

export const TEXT_GLOW =
    "text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]";

// (opcional) tokens mais usados no teu projeto
export const GLASS_PANEL =
    "relative rounded-3xl border-2 border-black bg-white backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]";

export const GLASS_INPUT =
    "h-12 w-full rounded-2xl border-2 border-black bg-white backdrop-blur-2xl px-3 text-black placeholder:text-neutral-500 shadow-[inset_0_1px_0_rgba(0,0,0,0.12)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40";

export const CARD_GLASS =
    "rounded-3xl border-2 border-black bg-white backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.30)]";

export const INPUT_GLASS =
    "w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-black placeholder:text-neutral-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/40";
