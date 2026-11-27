import { useMemo } from "react";

interface SparklesProps {
  count?: number;
  /** CSS opacity ceiling for subtlety */
  maxOpacity?: number;
}

/**
 * Delicate twinkling sparkles scattered across a slide.
 * Positions are randomized once per mount and kept stable.
 */
export default function Sparkles({ count = 26, maxOpacity = 0.9 }: SparklesProps) {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + Math.random() * 4;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: size,
        height: size,
        duration: `${2.5 + Math.random() * 3.5}s`,
        delay: `${Math.random() * 4}s`,
        opacity: 0.3 + Math.random() * maxOpacity * 0.7,
      };
    });
  }, [count, maxOpacity]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.width,
            height: s.height,
            opacity: s.opacity,
            // @ts-expect-error custom properties are valid in React style
            "--twinkle-duration": s.duration,
            "--twinkle-delay": s.delay,
          }}
        />
      ))}
    </div>
  );
}
