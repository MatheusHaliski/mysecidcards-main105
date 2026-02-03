type VSModalProps = {
    message: string;
    tone?: "success" | "error";
};

export default function VSModal({ message, tone = "success" }: VSModalProps) {
    const textColor = tone === "error" ? "text-rose-100" : "text-white";
    const borderTone = tone === "error" ? "border-rose-300/60" : "border-emerald-200/70";
    const GLOW_BAR =
        "bg-gradient-to-r border-amber-200/80 border-4 from-cyan-400 via-teal-400 to-emerald-400 " +
        "shadow-[0_14px_45px_rgba(16,185,129,0.25)]";

    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border px-5 py-4 text-sm font-semibold",
                "bg-gradient-to-br from-emerald-500 via-teal-600 to-orange-500",
                "shadow-[0_18px_40px_rgba(16,185,129,0.25)]",
                borderTone,
                textColor,
            ].join(" ")}
            role="status"
            aria-live="polite"
        >
            <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/70 via-teal-500/60 to-orange-400/60" />
                <div
                    className="absolute -top-16 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full
                    bg-[radial-gradient(circle_at_50%_45%,rgba(134,239,172,0.6),transparent_65%)]
                    blur-3xl"
                />
                <div
                    className="absolute -bottom-20 right-8 h-60 w-60 rounded-full
                    bg-[radial-gradient(circle_at_50%_50%,rgba(254,240,138,0.5),transparent_70%)]
                    blur-[70px]"
                />
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute -left-3 -top-4 h-12 w-12"
                />
                <img
                    src="/losangle-orange.svg"
                    alt=""
                    className="absolute -right-2 -top-2 h-10 w-10"
                />
                <img
                    src="/losangle-blue.svg"
                    alt=""
                    className="absolute left-6 bottom-1 h-8 w-8 opacity-80"
                />
                <img
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute -left-2 bottom-2 h-8 w-8"
                />
                <img
                    src="/star-orange.svg"
                    alt=""
                    className="absolute bottom-0 right-4 h-9 w-9"
                />
                <img
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute right-12 top-8 h-6 w-6 opacity-80"
                />
            </div>
            <div
                className={[
                    "relative z-10 mb-3 h-2 w-full rounded-full",
                    GLOW_BAR,
                ].join(" ")}
            />
            <span className="relative z-10">{message}</span>
        </div>
    );
}
