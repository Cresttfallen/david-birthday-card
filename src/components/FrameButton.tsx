import type { ReactNode } from "react";

interface FrameButtonProps {
  onClick: () => void;
  children: ReactNode;
  /** "light" = white frame on dark slides, "dark" = charcoal frame on light slides */
  tone?: "light" | "dark";
  className?: string;
  ariaLabel?: string;
}

/**
 * The words themselves are the button: an elegant hairline frame
 * drawn around the text — no pill shapes, no colorful fills.
 */
export default function FrameButton({
  onClick,
  children,
  tone = "light",
  className = "",
  ariaLabel,
}: FrameButtonProps) {
  const isLight = tone === "light";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        group relative inline-flex flex-nowrap items-center justify-center gap-3
        px-8 py-3.5
        font-serif text-[0.8rem] sm:text-sm tracking-[0.35em] uppercase
        transition-all duration-500 ease-out
        focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2
        ${
          isLight
            ? "text-white border border-white/55 hover:border-white hover:bg-white/[0.08] focus-visible:ring-white/70 focus-visible:ring-offset-black/60"
            : "text-[#1c1a19] border border-[#1c1a19]/55 hover:border-[#1c1a19] hover:bg-black/[0.05] focus-visible:ring-[#1c1a19]/70 focus-visible:ring-offset-white/70"
        }
        ${className}
      `}
      style={{ letterSpacing: "0.35em" }}
    >
      {/* Delicate inner hairline for a framed-letter feel */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[3px] border ${
          isLight ? "border-white/15" : "border-black/10"
        } transition-opacity duration-500 opacity-0 group-hover:opacity-100`}
      />
      <span
        className="relative inline-flex flex-nowrap items-center gap-2 whitespace-nowrap pl-[0.35em]"
        style={{
          color: "#ffffff"
        }}>{children}</span>
    </button>
  );
}
