# Happy 19th Birthday, David Truta — Interactive Digital Birthday Card

A multi-stage, interactive digital birthday card with a dreamy, vintage, romantic aesthetic — like an old-fashioned romantic birthday letter made digital. Built with React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Project Status

- **Project Type**: React + TypeScript single-page experience (no routing — internal stage state)
- **Entry Point**: `src/main.tsx`
- **Build**: `pnpm install && pnpm run build` (preview: `pnpm run preview`)
- **Styling**: Tailwind CSS 3 + custom CSS in `src/index.css`
- **Typography**: **IBM Plex Serif** (loaded from Google Fonts in `index.html`, `font-serif` mapped in `tailwind.config.js`)

## The 7 Stages

| # | Stage | Background (user's photo) | Content |
|---|-------|---------------------------|---------|
| 1 | Intro | White owl on black (`src/assets/intro-owl.jpg`) | Typing animation of "Happy 19th Birthday, David Truta!", sparkles, **confetti (slide 1 only)** that falls and settles at the bottom, white minimal envelope "Open Your Card" button |
| 2 | Letter | Dreamy flower (`src/assets/letter-flower.jpg`) | Elegant letter card with black heart, **editable birthday message** (IBM Plex Serif) |
| 3 | Keepsake page 1 | User-selectable (background picker) | Fully editable blank title + body — no placeholder paragraphs |
| 4 | Birthday cake | Cake photo (`src/assets/cake.jpg`) | "Happy 19th Birthday!" at top; **hidden YouTube iframe auto-plays** `x3xfijEQufU` on entry (no visible player/URL) |
| 5 | Twin | Two owls (`src/assets/twin-owls.jpg`) | Only text: "I love you twin." with delicate dreamy glow |
| 6 | Keepsake page 2 | User-selectable | Second editable blank page |
| 7 | Ending | Vintage swans (`src/assets/swans.jpg`) | Unmodified photo, "Begin again" restart button |

Stage order lives in the `STAGES` array in `src/App.tsx`. Keyboard: Arrow Left/Right navigates (unless focus is in an editable region).

## Key Implementation Notes

- **Confetti** (`src/components/Confetti.tsx`): canvas particles in muted pastels; only mounted on the intro slide, particles settle on the floor and stay. Subtle by design — no bright colors.
- **Editable text** (`src/components/EditableText.tsx`): `contentEditable` regions persisted to `localStorage` under `david19.*` keys (letter, page titles/bodies, page backgrounds). Click text to edit; edits survive reload. Clearing site data restores defaults.
- **Background picker**: on both keepsake pages (bottom "background" toggle) — choose from the six supplied looks incl. solid black. Light backgrounds automatically switch text/button to charcoal tone.
- **Buttons** (`src/components/FrameButton.tsx`): the text itself is the button — an elegant hairline frame around the words, no pill shapes, no colors. `tone="light"|"dark"` adapts to the slide.
- **YouTube song**: `.youtube-audio` class = 1×1 clipped invisible iframe with `autoplay=1`, mounted only while the cake stage is active, so music plays automatically on entry and stops when David moves on.
- **Transitions**: Framer Motion `AnimatePresence` cross-fades (1.1s) between all stages.
- **Photos**: never modified or replaced — served as `object-cover` with only a soft vignette veil (`.photo-veil`) where needed for text legibility.

## Customizing Later

- Edit text directly in the browser (it persists) — no code changes needed.
- Change stage copy/order in `src/App.tsx` (`STAGES`, `DEFAULT_LETTER`, stage components).
- Swap photos in `src/assets/` (keep filenames).
- Glow utilities: `.text-glow-soft`, `.text-glow-dreamy`, `.text-glow-charcoal` in `src/index.css`.

## Design Constraints (established with the user)

- IBM Plex Serif everywhere; no Comic Sans or playful fonts.
- Palette: white, black, charcoal, muted gray, soft neutrals only — must complement the monochromatic photographs.
- Confetti ONLY on the introduction slide; no candle-lighting interactions; no colorful icons; no generic birthday filler text.
- One consistent vintage-romantic aesthetic from beginning to end; responsive on phone and desktop.
