type VSModalProps = {
    message: string;
    tone?: "success" | "error";
};

export default function VSModal({ message, tone = "success" }: VSModalProps) {
    const textColor = tone === "error" ? "text-rose-700" : "text-orange-900";

    return (
        <div
            className={[
                "relative overflow-hidden rounded-xl border-2 border-orange-400 bg-white px-5 py-4 text-sm font-semibold",
                "shadow-[0_18px_40px_rgba(249,115,22,0.18)]",
                textColor,
            ].join(" ")}
            role="status"
            aria-live="polite"
        >
            <div className="pointer-events-none absolute inset-0 opacity-45">
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
                    src="/star-gradient.svg"
                    alt=""
                    className="absolute -left-2 bottom-2 h-8 w-8"
                />
                <img
                    src="/star-orange.svg"
                    alt=""
                    className="absolute bottom-0 right-4 h-9 w-9"
                />
            </div>
            <span className="relative z-10">{message}</span>
        </div>
    );
}