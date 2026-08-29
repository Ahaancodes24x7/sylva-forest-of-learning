# Syllabus Forest Live

Build "SYLVA" — a web app that turns a student's syllabus into a living, growing

forest that visualizes what they know, what they're forgetting, and what they

need to learn next. This is a demo-quality, fully interactive front-end using

mock data (no real backend integration needed yet — use realistic seeded data

and local React state).




═══════════════════════════════════════════

BRAND & VISUAL IDENTITY

═══════════════════════════════════════════

- Name: SYLVA. Tagline: "Your curriculum, alive."

- Mood: calm, organic, focused — the opposite of a stressful productivity app.

  Think Notion's calm + a nature documentary's warmth + Duolingo's playful

  motion, but muted and premium, never cartoonish.

- Color palette: deep forest green (#1B3A2F) as primary, warm moss (#5C8A6A)

  as secondary, soft canopy gold (#E8C468) as accent for growth/success

  moments, bark brown (#3A2E28) for grounding text, and a warm off-white

  paper background (#FAF7F0) — not clinical white. Dark mode: near-black

  forest (#0D1712) background with the same green/gold accents glowing softly.

- Typography: a warm humanist sans-serif for UI (e.g. "General Sans" or

  "Inter") paired with a slightly organic serif for headings (e.g. "Fraunces"

  or "Lora") to reinforce the "living" feel. Generous line height, no dense

  paragraphs — this app is built for users with attention/working-memory

  differences, so whitespace is a functional requirement, not decoration.

- Iconography: line icons with slightly rounded, organic strokes (leaves,

  roots, branches, seedlings) rather than sharp geometric icons.

- Motion philosophy: everything breathes. Use spring-based easing

  (framer-motion, stiffness ~120, damping ~14) rather than linear/ease-in-out.

  Nothing should feel mechanical. Elements grow, unfurl, and settle — never

  just fade or slide flatly.




═══════════════════════════════════════════

TECH & LIBRARIES

═══════════════════════════════════════════

- React + Tailwind CSS.

- framer-motion for all UI motion/transitions.

- react-three-fiber + drei for the 3D forest centerpiece (a single canvas,

  not a whole 3D app — keep it performant, low-poly/stylized geometry,

  soft gradient lighting, gentle ambient particle drift like floating pollen

  or light shafts through canopy).

- recharts for the knowledge-decay curves and workload charts.

- Use skeleton/shimmer loading states with a "growing sprout" loading motif

  instead of generic spinners.




═══════════════════════════════════════════

CORE SCREENS (build all of these)

═══════════════════════════════════════════




1) ONBOARDING / SYLLABUS UPLOAD

   - A single, calm centered card: "Drop in your syllabus." Drag-and-drop

     zone with a subtle glowing dashed border (organic, hand-drawn feel,

     not a rigid rectangle).

   - On "upload" (mock a file being processed), show an animated parsing

     sequence: a progress narrative reading through short steps ("Reading

     course structure...", "Mapping concepts...", "Finding what matters

     most...") each with a small animated seedling icon that grows a leaf

     per step.

   - End on a single punchy reveal card: "Stereochemistry is the concept

     most likely to challenge you this semester — here's why," with a two

     line explanation (deadline density + historical difficulty pattern).

     This is the "hook" screen — make it feel like an insight, not a form

     result. Big serif headline, generous motion on reveal (scale + fade

     + slight upward drift).




2) THE FOREST — MAIN DASHBOARD (the centerpiece, build this with real care)

   - Full-width react-three-fiber canvas as the hero of the dashboard: a

     stylized low-poly forest representing the student's overall knowledge

     state across all courses.

   - Each course = a distinct grove/cluster of trees. Each major concept =

     one tree. Tree states, each with distinct visual treatment and a

     smooth animated transition between states:

       • Mastered & fresh = full green canopy, gentle sway animation

       • Mastered but decaying = canopy visibly thinning, leaves occasionally

         drift off and fall (particle effect) as a "forgetting" cue

       • In progress = a sapling with a few leaves, growing slowly

       • Not yet covered = bare ground with a small dormant seed marker

       • Currently at-risk / needs attention = a soft warm gold glow pulsing

         at the base of the tree (never red/alarming — this app must never

         feel punitive or anxiety-inducing)

   - Camera: gentle auto-orbit when idle (very slow, subtle), user can

     drag to rotate/zoom (orbit controls, damped).

   - Clicking a tree smoothly zooms the camera toward it and opens a side

     panel with that concept's detail (mastery %, last reviewed, decay

     curve chart, "review this concept" CTA).

   - Top bar over the canvas: a slim glass/blur header with course

     selector pills, a search bar, and a small avatar/profile icon.

   - A floating "Today" summary card overlays the bottom-left of the

     canvas (glassmorphism, soft shadow): "3 concepts ready for review,

     1 assignment due in 2 days" with tiny animated icons.




3) THE TEACHING ENGINE — MICRO-LESSON FLOW

   - Full-screen, single-focus modal/takeover (minimizes distraction by

     design — one idea per screen, matching the working-memory-friendly

     teaching format from the concept).

   - Each micro-lesson screen shows ONE idea, large centered text, a small

     supporting illustration (simple line-art style, animate it drawing

     itself in on entry with a stroke-draw animation).

   - Bottom of screen: a slim progress bar styled as a growing vine/root

     filling left to right, not a generic loading bar.

   - End each micro-lesson with a single concept-check question (multiple

     choice, large tappable cards, satisfying spring-scale animation on

     selection). Correct answer triggers a small celebratory animation:

     a leaf sprouts on the relevant tree back in the forest view (if

     coming from the dashboard) — tie the micro-interaction back to the

     forest metaphor everywhere possible.

   - Include a "warm start" entry variant: before a hard assignment, show

     a gently-worded interstitial — "Before you start, a 4-minute primer

     on the concept most likely to slow you down" — with a clear skip

     option (never force it; respect user autonomy).




4) CONTEXT HIBERNATION / RE-ENTRY CARD

   - When a user returns to an assignment after being away, show a soft

     slide-up card (not a modal blocking the whole screen): "Welcome

     back. You were on: [paragraph 2, defining chirality]. Next planned

     step: [apply it to the synthesis problem]." Include a small "picking

     up where you left off" root/vine icon animating into place.

   - This card should feel like a gentle tap on the shoulder, not an

     alert — muted colors, soft entrance, dismissable with one tap.




5) THE COLLISION ZONE / WORKLOAD VIEW

   - A horizontal timeline (weeks of the semester) rendered as a winding

     forest path/trail rather than a flat Gantt bar. Deadline-dense weeks

     show visual "thickets" (denser tree clustering) along the path;

     light weeks show open clearings.

   - Hovering/tapping a week reveals a card with per-course workload

     breakdown (small stacked bar or donut via recharts, styled in the

     brand palette) and the system's auto-generated prep plan for that

     week ("Started spreading Week 11 prep 18 days early").

   - Use a subtle parallax scroll effect as the user scrolls along the

     timeline — background tree layers move slower than foreground path.




6) KNOWLEDGE MAP DETAIL / DECAY CHARTS

   - Per-course view: a recharts line chart showing mastery probability

     over time per concept, styled with soft gradient fills under the

     lines (green fading to transparent) rather than harsh chart-library

     defaults. Axis labels minimal, gridlines nearly invisible.

   - A "review now" button next to any decaying concept opens the

     micro-lesson flow directly (Screen 3) with spaced-repetition framing:

     "This concept is fading — a 2-minute refresh now saves you 20 minutes

     before the exam."




7) FUNCTIONAL PROFILE CARD (soft, non-diagnostic language only)

   - A quiet, optional section (not front-and-center) showing plain-language

     functional insights, e.g. "You tend to start strong on short tasks

     and lose steam after about 20 minutes — SYLVA now breaks your longer

     tasks into shorter chunks automatically." Never uses clinical or

     diagnostic terms. Presented as a helpful pattern, with a toggle to

     turn off any specific adaptation.




8) SETTINGS / PRIVACY

   - Clean list-style settings screen. Every data-collecting feature has

     its own named toggle with a one-line plain-English explanation and

     a visible "what this does NOT do" note. Include a prominent

     "Export my data" and "Delete everything" action, styled with the

     same calm care as the rest of the app (no dark patterns, no guilt

     copy, no confirmation friction beyond a single clear confirm step).




═══════════════════════════════════════════

MOTION & MICRO-INTERACTION SPEC

═══════════════════════════════════════════

- Page transitions: soft cross-fade + slight vertical drift (12px), spring

  easing, ~350ms.

- Buttons: on hover, a subtle organic "grow" scale (1 → 1.03) with a soft

  shadow bloom; on tap, a quick springy compress (1 → 0.97 → 1).

- Success states (correct answer, task completed, review finished): a

  leaf/sprout particle burst using framer-motion's AnimatePresence + a

  small custom particle component — 6-10 particles, staggered, drifting

  upward and fading, never confetti-explosion scale (keep it calm).

- Loading states: replace spinners everywhere with a small looping

  seedling-to-sprout growth animation (2-3 keyframes, looped, ease-in-out).

- Never use red for errors or warnings — use the warm gold accent for

  "needs attention" and a muted terracotta only for true errors (e.g.

  failed upload), and always pair color with an icon + text, not color

  alone (accessibility).




═══════════════════════════════════════════

RESPONSIVE / ACCESSIBILITY REQUIREMENTS

═══════════════════════════════════════════

- Fully responsive: on mobile, the 3D forest canvas simplifies to a

  lighter 2D/isometric illustrated equivalent (same visual language,

  lower render cost) — detect viewport and swap.

- Respect prefers-reduced-motion: provide a reduced-motion variant for

  every animation (simple fades instead of springs/particles).

- All interactive elements keyboard-navigable with visible focus states

  styled in the brand palette (not browser default blue).

- Text contrast meets WCAG AA against both light and dark backgrounds.

- One idea/action per screen wherever possible; avoid dense multi-column

  layouts that increase cognitive load.




═══════════════════════════════════════════

MOCK DATA TO SEED

═══════════════════════════════════════════

Generate realistic mock data for: 3 courses (e.g. Organic Chemistry,

Intro to CS, English Composition), each with 6-10 concepts in varying

mastery states, a 14-week semester timeline with 2-3 "collision zone"

weeks, and a sample micro-lesson (3 short screens + 1 concept check) for

at least one concept so the teaching flow is fully demoable end to end.




Build this as a cohesive, navigable prototype — home/forest dashboard as
the default landing screen after onboarding, with a persistent left-rail
or bottom-nav (mobile) to jump between Forest, Timeline, and Settings.

## Development

To run this project locally, ensure you have Node.js and npm (or bun/pnpm) installed.

```sh
git clone https://github.com/Ahaancodes24x7/sylva-forest-of-learning.git
cd sylva-forest-of-learning
npm install
npm run dev
```
