import type { ReactNode } from "react";

type AuthShellProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
};

const GLASS = "border border-white/20 bg-white/10";
const GLASS_DEEP = "border border-white/18 bg-white/8 backdrop-blur-2xl";

const FILTER_GLOW_BAR =
    "bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_12px_40px_rgba(124,58,237,0.18)]";
const FILTER_GLOW_LINE =
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(800px_200px_at_50%_0%,rgba(124,58,237,0.35),transparent_55%)]";

const GLOW_BAR =
    "bg-gradient-to-r border-amber-300 border-8 from-cyan-500 via-teal-400 to-emerald-500 " +
    "shadow-[0_14px_45px_rgba(16,185,129,0.25)]";

const GLOW_LINE =
    "after:content-[''] border-amber-300 border-8 after:absolute after:left-6 after:right-6 after:-bottom-2 " +
    "after:h-[10px] after:rounded-full after:bg-gradient-to-r after:from-cyan-400/40 after:via-teal-300/40 after:to-emerald-400/40 " +
    "after:blur-xl";

const TEXT_GLOW = "text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]";

// 🍏 Apple Glassmorphism Tokens
const GLASS_PANEL =
    "relative rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]";

const GLASS_INPUT =
    "h-12 w-full rounded-2xl border border-white/14 bg-white/[0.08] backdrop-blur-2xl px-3 text-white placeholder:text-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35";

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
    return (
        <div
            className={[
                "relative overflow-hidden",
                "space-y-8",
                "-translate-y-[10px]",
                "rounded-3xl",
                "bg-transparent",
                "border-amber-300",
                "p-8",
                "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
            ].join(" ")}
        >

        {/* ✅ Fundo: glow verde claro + glow amarelo claro (bem leve) */}
            <div className="pointer-events-none absolute inset-0">
                {/* “wash” branco suave (base) */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-teal-600 to-orange-500" />

                {/* glow verde claro (bem claro) */}
                <div className="absolute -top-44 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full
                  bg-[radial-gradient(circle_at_50%_40%,rgba(134,239,172,0.45),transparent_62%)]
                  blur-[150px] opacity-80" />

                <div className="absolute top-[18%] -left-56 h-[760px] w-[760px] rounded-full
                  bg-[radial-gradient(circle_at_55%_45%,rgba(110,231,183,0.35),transparent_64%)]
                  blur-[170px] opacity-70" />

                {/* glow amarelo claro (bem claro) */}
                <div className="absolute bottom-[4%] -right-60 h-[820px] w-[820px] rounded-full
                  bg-[radial-gradient(circle_at_45%_50%,rgba(253,224,71,0.28),transparent_66%)]
                  blur-[180px] opacity-75" />

                <div className="absolute -bottom-44 left-[18%] h-[640px] w-[640px] rounded-full
                  bg-[radial-gradient(circle_at_50%_50%,rgba(254,240,138,0.25),transparent_70%)]
                  blur-[170px] opacity-70" />

                {/* textura de grid MUITO sutil */}
                <div className="absolute inset-0 opacity-[0.05]
                  [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.32)_1px,transparent_0)]
                  [background-size:18px_18px]" />
            </div>

            <div className="absolute left-6 border-white w-500 top-1/2 z-20 translate-x-[100px] -translate-y-[600px]">
                <div
                    className={[
                        "relative",
                        "rounded-3xl",
                        "px-5 py-4",
                        "w-500",
                        "bg-white",
                        "text-amber-500",
                        GLOW_LINE,
                        "shadow-[0_18px_60px_rgba(0,0,0,0.25)]",
                    ].join(" ")}
                >
                    <div className="flex h-30  items-center gap-4">
                        <img
                            src="/v.png"
                            alt="Velion Infyra Technology Platforms, Inc."
                            className="h-20 w-auto"
                        />
                        <div className="hidden sm:block font-sametech leading-tight">
                            <div className="text-xs font-semibold tracking-[0.22em] text-amber-500 uppercase">
                                Velion
                            </div>
                            <div className="text-sm font-semibold text-amber-500">
                                Infyra Tech Platforms
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* decorations */}
            <div className="pointer-events-none absolute inset-0">
                {/* original */}
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute left-6 top-50 h-24 w-24 drop-shadow-[0_16px_30px_rgba(37,99,235,0.25)]"
                />
                <img
                    src="/losangle-orange.svg"
                    alt=""
                    className="absolute right-10 bottom-24 h-24 w-24 drop-shadow-[0_16px_30px_rgba(249,115,22,0.25)]"
                />
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute right-24 top-28 h-16 w-16 opacity-70"
                />
                <img
                    src="/losangle-orange.svg"
                    alt=""
                    className="absolute left-16 bottom-20 h-16 w-16 opacity-70"
                />
                <img
                    src="/star-orange.svg"
                    alt=""
                    className="absolute right-2 top-52 h-14 w-14 opacity-80"
                />
                <img
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute left-2 top-120 h-14 w-14 opacity-80"
                />
                <img
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute right-4 bottom-14 h-10 w-10 opacity-70"
                />

                {/* ✅ more spread decorations */}
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute left-20 top-24 h-10 w-10 opacity-60 rotate-12"
                />
                <img
                    src="/losangle-orange.svg"
                    alt=""
                    className="absolute left-40 top-44 h-14 w-14 opacity-55 -rotate-6"
                />
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute left-[38%] top-16 h-12 w-12 opacity-55 rotate-45"
                />
                <img
                    src="/losangle-orange.svg"
                    alt=""
                    className="absolute right-[34%] top-20 h-10 w-10 opacity-50 -rotate-12"
                />
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute right-16 top-64 h-14 w-14 opacity-60 rotate-[18deg]"
                />
                <img
                    src="/losangle-orange.svg"
                    alt=""
                    className="absolute left-10 bottom-40 h-12 w-12 opacity-55 rotate-[22deg]"
                />
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute left-[55%] bottom-16 h-16 w-16 opacity-50 -rotate-[14deg]"
                />

                <img
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute right-10 top-28 h-10 w-10 opacity-60"
                />
                <img
                    src="/star-orange.svg"
                    alt=""
                    className="absolute left-10 top-72 h-9 w-9 opacity-60"
                />
                <img
                    src="/star-orange.svg"
                    alt=""
                    className="absolute left-[46%] top-[58%] h-12 w-12 opacity-45"
                />
                <img
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute right-[45%] bottom-24 h-10 w-10 opacity-55"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute right-14 top-40 h-16 w-16 opacity-85 drop-shadow-[0_18px_40px_rgba(0,0,0,0.18)] rotate-[8deg]"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute left-12 bottom-24 h-12 w-12 opacity-70 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] -rotate-[12deg]"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute right-112 bottom-64 h-12 w-12 opacity-70 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] -rotate-[12deg]"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute left-12 bottom-84 h-12 w-12 opacity-70 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] -rotate-[12deg]"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute right-52 bottom-94 h-12 w-12 opacity-70 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] -rotate-[62deg]"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute right-12 bottom-194 h-12 w-12 opacity-70 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] -rotate-[62deg]"
                />
                <img
                    src="/pipa.png"
                    alt=""
                    className="absolute right-12 top-294 h-12 w-12 opacity-70 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] -rotate-[62deg]"
                />
                {/* ✅ add-ons: +10 losangos */}
                <img src="/losangle-blue.svg" alt="" className="absolute left-[8%]  top-[18%]  h-9  w-9  opacity-55 rotate-[10deg]" />
                <img src="/losangle-orange.svg" alt="" className="absolute left-[14%] top-[62%]  h-12 w-12 opacity-45 -rotate-[8deg]" />
                <img src="/losangle-blue.svg" alt="" className="absolute left-[28%] top-[10%]  h-8  w-8  opacity-50 rotate-[22deg]" />
                <img src="/losangle-orange.svg" alt="" className="absolute left-[32%] bottom-[18%] h-10 w-10 opacity-50 -rotate-[14deg]" />
                <img src="/losangle-blue.svg" alt="" className="absolute left-[44%] top-[30%]  h-14 w-14 opacity-35 rotate-[36deg]" />
                <img src="/losangle-orange.svg" alt="" className="absolute left-[52%] top-[74%]  h-9  w-9  opacity-45 rotate-[18deg]" />
                <img src="/losangle-blue.svg" alt="" className="absolute right-[30%] top-[14%]  h-10 w-10 opacity-45 -rotate-[20deg]" />
                <img src="/losangle-orange.svg" alt="" className="absolute right-[18%] top-[46%] h-14 w-14 opacity-30 rotate-[28deg]" />
                <img src="/losangle-blue.svg" alt="" className="absolute right-[12%] bottom-[30%] h-9 w-9 opacity-50 rotate-[12deg]" />
                <img src="/losangle-orange.svg" alt="" className="absolute right-[8%]  bottom-[12%] h-10 w-10 opacity-45 -rotate-[16deg]" />

                {/* ✅ add-ons: +10 estrelas */}
                <img src="/star-gradient.svg" alt="" className="absolute left-[6%]  top-[38%]  h-9  w-9  opacity-55 drop-shadow-[0_16px_30px_rgba(37,99,235,0.16)]" />
                <img src="/star-orange.svg"  alt="" className="absolute left-[18%] top-[12%]  h-8  w-8  opacity-55 drop-shadow-[0_16px_30px_rgba(249,115,22,0.14)] rotate-[14deg]" />
                <img src="/star-gradient.svg" alt="" className="absolute left-[22%] bottom-[10%] h-10 w-10 opacity-45 rotate-[-10deg]" />
                <img src="/star-orange.svg"  alt="" className="absolute left-[36%] top-[42%]  h-12 w-12 opacity-35 rotate-[20deg]" />
                <img src="/star-gradient.svg" alt="" className="absolute left-[48%] top-[8%]   h-9  w-9  opacity-50 rotate-[6deg]" />
                <img src="/star-orange.svg"  alt="" className="absolute left-[58%] bottom-[22%] h-10 w-10 opacity-45 -rotate-[18deg]" />
                <img src="/star-gradient.svg" alt="" className="absolute right-[26%] top-[34%] h-9  w-9  opacity-55 rotate-[12deg]" />
                <img src="/star-orange.svg"  alt="" className="absolute right-[14%] top-[18%] h-10 w-10 opacity-50 -rotate-[8deg]" />
                <img src="/star-gradient.svg" alt="" className="absolute right-[10%] bottom-[40%] h-12 w-12 opacity-35 rotate-[16deg]" />
                <img src="/star-orange.svg"  alt="" className="absolute right-[6%]  bottom-[22%] h-9  w-9  opacity-55 -rotate-[14deg]" />

                {/* ✅ add-ons: +10 pipas */}
                <img src="/pipa.png" alt="" className="absolute left-[10%] top-[26%]  h-12 w-12 opacity-65 drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)] rotate-[18deg]" />
                <img src="/pipa.png" alt="" className="absolute left-[20%] top-[84%]  h-10 w-10 opacity-55 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] -rotate-[24deg]" />
                <img src="/pipa.png" alt="" className="absolute left-[30%] top-[18%]  h-9  w-9  opacity-60 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] rotate-[32deg]" />
                <img src="/pipa.png" alt="" className="absolute left-[42%] top-[60%]  h-12 w-12 opacity-50 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] -rotate-[10deg]" />
                <img src="/pipa.png" alt="" className="absolute left-[54%] top-[28%]  h-10 w-10 opacity-60 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] rotate-[46deg]" />
                <img src="/pipa.png" alt="" className="absolute left-[62%] bottom-[12%] h-12 w-12 opacity-50 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] -rotate-[38deg]" />
                <img src="/pipa.png" alt="" className="absolute right-[34%] top-[54%] h-10 w-10 opacity-60 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] rotate-[14deg]" />
                <img src="/pipa.png" alt="" className="absolute right-[22%] top-[10%] h-12 w-12 opacity-55 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] -rotate-[20deg]" />
                <img src="/pipa.png" alt="" className="absolute right-[16%] bottom-[18%] h-10 w-10 opacity-60 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] rotate-[28deg]" />
                <img src="/pipa.png" alt="" className="absolute right-[8%]  top-[72%]  h-12 w-12 opacity-50 drop-shadow-[0_18px_40px_rgba(0,0,0,0.12)] -rotate-[52deg]" />

            </div>

            <main className="min-w-520 items-center rounded-3xl border-amber-300 flex items-center justify-center px-66 py-56">
                <div
                    className={[
                        "relative flex flex-wrap items-center justify-between gap-10 px-12 py-8",
                        "rounded-3xl",
                        GLOW_BAR,
                        "border-amber-300 border-8",
                        GLOW_LINE,

                        "w-[900px]", // 🔥 agora SIM cresce
                    ].join(" ")}
                >
                    <div className="flex items-center flex-col w-500 rounded-3xl border-white -translate-y-[-40px] items-center gap-6 text-center">
                        <div className="items-center w-100  rounded-3xl border-white translate-x-[90px] -translate-y-[120px] text-center">
                            <img
                                src="/v.jpeg"
                                alt="Velion Logo"
                                className="h-40 w-170  items-center rounded-3xl border-amber-300 border-8 translate-x-[160px] -translate-y-[-80px]"
                            />

                            <img
                                src="/ves.png"
                                alt="Velion Logo"
                                className="h-40 w-15 -translate-y-[20px] translate-x-[150px]"
                            />
                        </div>
                    </div>

                    {/* ✅ FORM RETANGLE: rounded + amber border-8 */}
                    <div
                            className={[
                            "space-y-8",
                            "-translate-y-[10px]",
                            "rounded-3xl",
                            "bg-transparent",
                            "border-amber-300",
                            "p-8",
                            "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
                            ].join(" ")}
                            >

                    <div className={[
                            "space-y-8",
                            "-translate-y-[10px]",
                            "rounded-3xl",
                            "border-amber-300 border-8", // ✅ requested
                            "bg-transparent",
                            "p-8",
                            "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
                        ].join(" ")}>
                            <p className="text-xs font-semibold items-center font-sharetech uppercase tracking-[0.35em] text-[#ffffff]">
                                {title}
                            </p>
                            <h1 className="text-3xl items-center font-semibold text-[#ffffff]">
                                {subtitle}
                            </h1>
                        </div>

                        {/* children wrapper (kept) */}
                        <div className="mt-6 space-y-6">{children}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
