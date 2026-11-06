# Brain.exe Has Stopped Working 🧠

A retro-futuristic, fake brain-diagnostic website built with plain HTML, CSS, and JavaScript. Answer twelve deeply questionable questions, receive a completely unscientific diagnosis, and share the damage with your friends.

> **100% scientifically inaccurate.** Every score is for entertainment only. This is not an IQ test, a psychological assessment, or medical advice. It is a joke with a progress bar.

---

## Overview

Brain.exe presents itself as a malfunctioning computer diagnostic tool. It boots into a CRT-inspired terminal, runs a "neural scan", asks you about ketchup smoothies and hallway arms, then produces a random-but-answer-influenced diagnosis such as **Certified Overthinker**, **Potato Brain**, or **Certified Genius (Probably Fake)**.

The entire site is self-contained. No frameworks, no build step, no backend, no external APIs, and no network requests. Open `index.html` and it works.

---

## Features

### Landing page
- Animated neon brain core with orbit rings, glow, and a scanning sweep.
- Live "system status" chatter that updates while you read.
- Looping terminal that types out diagnostic messages.
- Glitch typography, CRT scanlines, grid background, and ambient canvas particles.

### The test
- **36-question bank**, randomly sampled into a **12-question test**.
- Questions spread across six categories: Overthinking, Common Sense, Logic, Random Thoughts, Everyday Situations, and Imagination.
- Previous questions are remembered and avoided in the next session when possible.
- Progress bar, question counter, category badge, and smooth card transitions.
- 2–4 answer choices per question, each with a custom funny reaction.
- Back / Next navigation with the last question becoming **Finish Test**.
- Restart from the result screen with **Test Again**.

### Fake analysis
- Animated terminal sequence with staged progress from 0% to 100%.
- Deliberate "ERROR: Logic not found" moments.
- Occasional fake crash dialogs with **Retry** and **Ignore (Recommended)**.
- Reduced-motion users get the same content without the typing delay.

### Results
- Twelve result archetypes, each with its own title, status, glyph, colour, descriptions, diagnoses, and warning.
- Scores for Intelligence, Overthinking, and Common Sense derived from answers plus a little chaos.
- Animated stat bars and a diagnostic quote.
- History of your last 20 runs stored in `localStorage`.
- Clear entertainment-only disclaimer on the result card.

### Sharing
- **Share Result** uses the Web Share API when available, attempting to include a generated PNG.
- **Download Result** exports a 1080 × 1080 social-ready card via Canvas.
- **Copy Result** uses the Clipboard API with a legacy `execCommand` fallback.
- If native sharing is unavailable, a share modal opens with a preview, copyable text, and download options.
- The generated card includes the site name, result title, status, scores, diagnosis, and disclaimer.

### Extras
- Sound effects generated entirely with the Web Audio API; toggle and persist the preference.
- Dark theme by default.
- Keyboard navigation: `1–4` to select an answer, `←` / `→` to move between questions, `Enter` to continue, `Esc` to close dialogs.
- LocalStorage preferences, history, and recent-question memory.
- Reset button with confirmation to clear history and preferences.
- Easter egg: click the brain logo five times.
- Respects `prefers-reduced-motion` and degrades gracefully when Canvas, Web Audio, Clipboard, Web Share, or `localStorage` are unavailable.

---

## File structure

```
brain-exe/
├── index.html          # All screens, modals, and structural markup
├── css/
│   └── style.css       # Theme, CRT effects, animations, responsive layout
├── js/
│   ├── questions.js    # Question bank + balanced random selection
│   ├── storage.js      # Defensive localStorage wrapper
│   ├── effects.js      # Web Audio, typewriter, particles, toasts, fake errors
│   ├── results.js      # Scoring, result catalogue, analysis, Canvas sharing
│   ├── quiz.js         # Quiz state machine and keyboard controls
│   └── app.js          # Screen routing, modals, history, easter egg
└── README.md
```

Scripts are intentionally loaded as classic scripts (not ES modules) so the site works when `index.html` is opened directly from the filesystem, where module imports are often blocked by browser CORS rules.

---

## Run locally

### Option 1 — just open it
Double-click `index.html`, or drag it into a browser. That is the whole setup.

### Option 2 — local static server (recommended for the best sharing behaviour)
Some browser APIs (notably the Clipboard API and native file sharing) behave better on `http://localhost` than on `file://`.

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000/brain-exe/` (adjust the path to wherever you placed the folder).

No dependencies need to be installed for Option 1.

---

## Deploy to GitHub Pages

1. Create a repository and push the contents of this folder so `index.html` is at the repository root (or inside `/brain-exe`).
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch (usually `main`) and the folder containing `index.html` (`/root` or `/docs`).
5. Save. GitHub will publish the site at:

```
https://<your-username>.github.io/<repository-name>/
```

No build step or environment variables are required. If you deploy the folder as-is, set the Pages folder to `/root` after moving `brain-exe`'s contents to the repository root, or place it in `/docs` and publish from that folder.

---

## Browser compatibility

| Feature | Behaviour |
|---|---|
| Core experience | Chrome, Edge, Firefox, Safari, and modern mobile browsers |
| Web Share API | Used automatically where supported; fallback modal otherwise |
| Clipboard API | Used on secure contexts; legacy `execCommand` fallback included |
| Canvas result image | Works in all Canvas-capable browsers; `toBlob` fallback to `toDataURL` |
| Web Audio API | Optional; silently skipped if unavailable |
| `localStorage` | Optional; the test still runs if storage is blocked (history/prefs simply do not persist) |
| `prefers-reduced-motion` | Disables typing delays and ambient animation |

Tested manually in Chromium via an automated end-to-end pass covering the full quiz flow, analysis, result rendering, Canvas export, share fallback, history, reset, sound persistence, easter egg, and mobile layout.

---

## LocalStorage keys

| Key | Contents |
|---|---|
| `brainexe.prefs.v1` | Sound preference |
| `brainexe.history.v1` | Last 20 results (title, status, scores, date, glyph) |
| `brainexe.recent.v1` | Question IDs used in the previous test |
| `brainexe.eggs.v1` | Easter-egg counter storage (reserved) |

Clearing site data or using the app's **Reset** button removes all of it.

---

## Notes on the scores

- Scores start from a neutral baseline and shift according to the answer weights you choose.
- A small amount of random noise is applied each run.
- The result title is selected with weighted randomness, influenced by your dominant traits and preventing the same title twice in a row where possible.
- The numbers are decorations. Please do not put them on a résumé.

---

## License

Do whatever you like with it. Attribution is appreciated but not required. No warranty; no brains were measured.
