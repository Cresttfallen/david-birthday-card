import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, ChevronRight } from "lucide-react";

import introOwl from "./assets/intro-owl.jpg";
import letterFlower from "./assets/letter-flower.jpg";
import cakePhoto from "./assets/cake.jpg";
import twinOwls from "./assets/twin-owls.jpg";
import swans from "./assets/swans.jpg";

import Confetti from "./components/Confetti";
import Sparkles from "./components/Sparkles";
import EditableText from "./components/EditableText";
import FrameButton from "./components/FrameButton";

/* ------------------------------------------------------------------ */
/*  Stage model                                                        */
/* ------------------------------------------------------------------ */

type StageId =
  | "intro"
  | "letter"
  | "page-one"
  | "cake"
  | "twin"
  | "page-two"
  | "ending";

const STAGES: StageId[] = [
  "intro",
  "letter",
  "page-one",
  "cake",
  "twin",
  "page-two",
  "ending",
];

const DEFAULT_LETTER = `Dear David,

I am so incredibly happy that we have a friendship that has lasted for such a long time. I truly cherish it, just as I cherish you and everything we talk about. I adore you, and I'm so glad that you're here this year, in good health and with plans for the future. I love you with all my heart, and I'm so happy that you are my best friend. Happy birthday!!

— Jhoana`;

const GREETING = "Happy 19th Birthday, David Truta!";

/** Backgrounds the owner can choose for the two blank keepsake pages. */
const BACKGROUND_CHOICES: { id: string; src: string | null; label: string }[] = [
  { id: "black", src: null, label: "Nocturne" },
  { id: "flower", src: letterFlower, label: "Bloom" },
  { id: "owls", src: twinOwls, label: "Twins" },
  { id: "owl", src: introOwl, label: "Owl" },
  { id: "swans", src: swans, label: "Swans" },
  { id: "cake", src: cakePhoto, label: "Cake" },
];

const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const },
};

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

function PhotoBackground({ src, veil = true }: { src: string; veil?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover object-center select-none"
        draggable={false}
      />
      {veil && <div className="photo-veil pointer-events-none absolute inset-0" />}
    </div>
  );
}

function NextButton({
  onNext,
  label = "Continue",
  tone = "light",
}: {
  onNext: () => void;
  label?: string;
  tone?: "light" | "dark";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
      className="flex justify-center"
    >
      <FrameButton onClick={onNext} tone={tone} ariaLabel={`${label} — go to next page`}>
        {label}
        <ChevronRight
          aria-hidden="true"
          className="h-3.5 w-3.5 -mr-[0.35em] opacity-70 transition-transform duration-500 group-hover:translate-x-1"
        />
      </FrameButton>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage 1 — Introduction (owl, typing greeting, sparkles, confetti)  */
/* ------------------------------------------------------------------ */

function IntroStage({ onNext }: { onNext: () => void }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(GREETING.slice(0, i));
      if (i >= GREETING.length) {
        window.clearInterval(timer);
        setDone(true);
        window.setTimeout(() => setShowButton(true), 600);
      }
    }, 62);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full bg-black">
      <PhotoBackground src={introOwl} />
      <Sparkles count={30} />
      <Confetti active={done} />

      {/* Centered greeting */}
      <div className="relative z-40 flex h-full w-full items-center justify-center px-6">
        <h1
          className={`font-serif text-center font-normal leading-[1.25] text-white text-glow-soft ${
            typed.length < GREETING.length ? "caret" : "caret-done"
          }`}
          style={{
            fontSize: "clamp(1.6rem, 5.2vw, 3.4rem)",
            letterSpacing: "0.04em",
            textWrap: "balance",
            minHeight: "2.6em",
          }}
        >
          {typed}
          {/* Reserve layout space so the photo never shifts while typing */}
          <span className="sr-only">{GREETING}</span>
        </h1>
      </div>

      {/* Open your card */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-[12vh] z-40 flex flex-col items-center gap-4 px-6"
          >
            <button
              type="button"
              onClick={onNext}
              aria-label="Open your card"
              className="group flex flex-col items-center gap-3 text-white/90 transition-colors duration-500 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-sm"
            >
              {/* Minimal, purely white envelope icon with a soft glow */}
              <span className="relative inline-flex h-14 w-14 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-white/45 transition-all duration-500 group-hover:border-white/90 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.35)]"
                />
                <Mail
                  aria-hidden="true"
                  className="h-6 w-6 text-white"
                  strokeWidth={1.25}
                  fill="none"
                />
              </span>
              <span
                className="font-serif text-[0.72rem] sm:text-xs uppercase text-white"
                style={{ letterSpacing: "0.4em" }}
              >
                Open&nbsp;Your&nbsp;Card
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage 2 — The letter (flower photo + editable card)                */
/* ------------------------------------------------------------------ */

function LetterStage({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative h-full w-full bg-black">
      <PhotoBackground src={letterFlower} />
      <Sparkles count={16} maxOpacity={0.6} />
      <div className="relative z-20 flex h-full w-full items-center justify-center overflow-y-auto px-4 pt-8 pb-28 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="letter-card w-full max-w-2xl rounded-sm px-6 py-7 sm:px-12 sm:py-11"
        >
          {/* Heart — pure black on the pale card */}
          <div className="mb-6 flex justify-center" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black/85">
              <path d="M12 21s-7.5-4.7-10-9.2C.4 8.7 2 5 5.4 5c2 0 3.4 1.2 4.1 2.3h5C15.2 6.2 16.6 5 18.6 5 22 5 23.6 8.7 22 11.8 19.5 16.3 12 21 12 21z" />
            </svg>
          </div>

          <div
            className="font-serif text-[#1c1a19] text-center"
            style={{ fontSize: "clamp(1rem, 2.4vw, 1.2rem)", lineHeight: 1.9 }}
          >
            <EditableText
              storageKey="david19.letter"
              defaultText={DEFAULT_LETTER}
              placeholder="Write your birthday message to David…"
              label="Birthday letter, editable"
              className="text-left"
            />
          </div>

          <p
            className="mt-6 text-center font-serif italic text-black/45"
            style={{ fontSize: "clamp(0.65rem, 1.6vw, 0.78rem)", letterSpacing: "0.28em" }}
          ></p>
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-6 z-30 sm:bottom-8">
        <NextButton onNext={onNext} tone="dark" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Keepsake pages — blank, fully editable, custom background          */
/* ------------------------------------------------------------------ */

function KeepsakeStage({
  page,
  onNext,
}: {
  page: 1 | 2;
  onNext: () => void;
}) {
  const bgKey = `david19.page${page}.bg`;
  const [bgId, setBgId] = useState<string>("black");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(bgKey);
    if (saved && BACKGROUND_CHOICES.some((c) => c.id === saved)) setBgId(saved);
  }, [bgKey]);

  const chosen = useMemo(
    () => BACKGROUND_CHOICES.find((c) => c.id === bgId) ?? BACKGROUND_CHOICES[0],
    [bgId],
  );

  const choose = (id: string) => {
    setBgId(id);
    localStorage.setItem(bgKey, id);
    setPickerOpen(false);
  };

  const isDark = chosen.src !== null && chosen.id !== "flower" && chosen.id !== "swans";

  return (
    <div className="relative h-full w-full bg-black">
      {chosen.src ? (
        <PhotoBackground src={chosen.src} />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
      <Sparkles count={chosen.src ? 12 : 24} maxOpacity={chosen.src ? 0.5 : 0.85} />

      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-10 overflow-y-auto px-6 py-24">
        <div className="w-full max-w-2xl">
          <div
            className={`font-serif text-center ${
              isDark ? "text-white text-glow-soft" : "text-[#1c1a19] text-glow-charcoal"
            }`}
            style={{ fontSize: "clamp(1.05rem, 2.8vw, 1.5rem)", lineHeight: 2 }}
          >
            <EditableText
              storageKey={`david19.page${page}.title`}
              placeholder="A title for your page…"
              label={`Keepsake page ${page} title, editable`}
              className="text-center block"
            />
            <div
              className="mt-6 block"
              style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.1rem)", lineHeight: 2 }}
            >
              <EditableText
                storageKey={`david19.page${page}.body`}
                placeholder="Write anything you'd like to say…"
                label={`Keepsake page ${page} message, editable`}
                className="text-left block"
              />
            </div>
          </div>
        </div>

        <NextButton onNext={onNext} label="Turn the page" tone={isDark ? "light" : "dark"} />
      </div>

      {/* Quiet background chooser */}
      <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            aria-expanded={pickerOpen}
            className="font-serif uppercase text-white/55 hover:text-white/90 transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded-sm px-2 py-1"
            style={{ fontSize: "0.6rem", letterSpacing: "0.3em" }}
          >
            {pickerOpen ? "close" : "background"}
          </button>
          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-2 rounded-sm border border-white/20 bg-black/70 px-3 py-2 backdrop-blur-sm"
              >
                {BACKGROUND_CHOICES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => choose(c.id)}
                    aria-label={`Background: ${c.label}`}
                    title={c.label}
                    className={`h-9 w-9 overflow-hidden rounded-sm border transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                      bgId === c.id
                        ? "border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                        : "border-white/25 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {c.src ? (
                      <img src={c.src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="block h-full w-full bg-black" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage 3 — Birthday cake + hidden YouTube song                      */
/* ------------------------------------------------------------------ */

function CakeStage({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative h-full w-full bg-black">
      <PhotoBackground src={cakePhoto} veil={false} />
      {/* Soft top gradient so the greeting reads against the dark photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[38vh] bg-gradient-to-b from-black/75 via-black/25 to-transparent"
      />

      {/* Hidden YouTube player — plays automatically, never visible */}
      <iframe
        className="youtube-audio"
        title="Birthday song"
        src="https://www.youtube.com/embed/x3xfijEQufU?autoplay=1&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />

      <Sparkles count={14} maxOpacity={0.55} />

      <div className="relative z-20 flex h-full w-full flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.3 }}
          className="font-serif text-center text-white text-glow-soft pt-[7vh] sm:pt-[9vh] px-6"
          style={{
            fontSize: "clamp(1.5rem, 4.6vw, 3rem)",
            letterSpacing: "0.08em",
            fontWeight: 400,
          }}
        >
          Happy 19th Birthday!
        </motion.h2>

        <div className="mt-auto mb-[7vh] w-full">
          <NextButton onNext={onNext} label="Next" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage 4 — "I love you twin." (two owls)                            */
/* ------------------------------------------------------------------ */

function TwinStage({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative h-full w-full bg-black">
      <PhotoBackground src={twinOwls} veil={false} />
      {/* Very gentle center lift so the words glow without hiding the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.18)_45%,rgba(0,0,0,0)_70%)]"
      />

      <div className="relative z-20 flex h-full w-full items-center justify-center px-6">
        <motion.p
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.35 }}
          className="font-serif text-center text-white text-glow-dreamy"
          style={{
            fontSize: "clamp(1.5rem, 4.4vw, 2.9rem)",
            letterSpacing: "0.1em",
            fontWeight: 400,
          }}
        >
          I love you twin.
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-30 sm:bottom-8">
        <NextButton onNext={onNext} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage 5 — Ending (vintage swans)                                   */
/* ------------------------------------------------------------------ */

function EndingStage({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="relative h-full w-full bg-black">
      <PhotoBackground src={swans} veil={false} />
      <Sparkles count={12} maxOpacity={0.45} />

      <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center sm:bottom-8">
        <FrameButton onClick={onRestart} tone="dark" ariaLabel="Read the card again">
          Begin again
        </FrameButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App — stage orchestration                                          */
/* ------------------------------------------------------------------ */

function App() {
  const [stage, setStage] = useState<StageId>("intro");
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const goNext = useCallback(() => {
    setStage((current) => {
      const idx = STAGES.indexOf(current);
      return idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1] : current;
    });
  }, []);

  const goPrev = useCallback(() => {
    setStage((current) => {
      const idx = STAGES.indexOf(current);
      return idx > 0 ? STAGES[idx - 1] : current;
    });
  }, []);

  // Keyboard navigation for desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || target?.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "PageUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const restart = useCallback(() => setStage("intro"), []);

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-black font-serif">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          {...fadeTransition}
          className="absolute inset-0"
        >
          {stage === "intro" && <IntroStage onNext={goNext} />}
          {stage === "letter" && <LetterStage onNext={goNext} />}
          {stage === "page-one" && <KeepsakeStage page={1} onNext={goNext} />}
          {stage === "cake" && <CakeStage onNext={goNext} />}
          {stage === "twin" && <TwinStage onNext={goNext} />}
          {stage === "page-two" && <KeepsakeStage page={2} onNext={goNext} />}
          {stage === "ending" && <EndingStage onRestart={restart} />}
        </motion.div>
      </AnimatePresence>

      {/* Delicate page progress — bottom right, unobtrusive */}
      {stage !== "intro" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 bottom-4 z-40 font-serif text-white/45"
          style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textShadow: "0 0 6px rgba(0,0,0,0.8)" }}
        >
          {String(STAGES.indexOf(stage) + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
        </div>
      )}
    </main>
  );
}

export default App;
