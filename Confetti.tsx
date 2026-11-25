import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  color: string;
  settled: boolean;
  sway: number;
  swayOffset: number;
}

/**
 * Soft pastel confetti that falls gently and settles at the bottom of the
 * screen, staying there. Mounted only on the introduction slide.
 */
export default function Confetti({ active = false }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId = 0;

    // Muted pastels that harmonize with a monochromatic vintage palette.
    const colors = [
      "rgba(248, 232, 232, 0.85)",
      "rgba(239, 230, 245, 0.85)",
      "rgba(253, 246, 227, 0.85)",
      "rgba(232, 240, 245, 0.85)",
      "rgba(245, 230, 224, 0.85)",
      "rgba(255, 255, 255, 0.8)",
      "rgba(214, 214, 214, 0.8)",
    ];

    const particles: Particle[] = [];
    const PARTICLE_COUNT = Math.min(140, Math.floor(width / 8));

    const spawn = (fromTop: boolean): Particle => ({
      x: Math.random() * width,
      y: fromTop ? -20 - Math.random() * height * 0.6 : Math.random() * height * 0.4,
      w: 4 + Math.random() * 6,
      h: 6 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.6 + Math.random() * 1.1,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      settled: false,
      sway: 0.4 + Math.random() * 0.9,
      swayOffset: Math.random() * Math.PI * 2,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = spawn(false);
      // Pre-fill the sky so the screen feels celebratory right when confetti begins.
      p.y = -Math.random() * height;
      particles.push(p);
    }

    let time = 0;
    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (activeRef.current && !p.settled) {
          p.vy = Math.min(p.vy + 0.004, 1.8);
          p.x += p.vx + Math.sin(time * 0.015 + p.swayOffset) * p.sway * 0.35;
          p.y += p.vy;
          p.rot += p.vr;

          // Settle gently at the bottom and stay there.
          const floor = height - p.h - Math.random() * 2;
          if (p.y >= floor) {
            p.y = floor;
            p.settled = true;
            p.rot = (Math.random() - 0.5) * 1.2;
          }

          if (p.x < -20) p.x = width + 10;
          if (p.x > width + 20) p.x = -10;
        }

        if (!activeRef.current && p.settled) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // Mix of thin ribbons and soft dots for a delicate look.
        if (p.w > 6.5) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
