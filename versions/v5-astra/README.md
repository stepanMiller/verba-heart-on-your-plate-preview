# VERBA V5 · Внутри обычного дня

High-fidelity creative prototype. One recurring fictional woman, 14 individually composed scenes: ordinary life → inside lipid transport → a consultation → ordinary life. This remains an art-direction prototype rather than a clinically approved production lecture. A completed separate 26-second foyer edit accompanies the preserved original animatic.

## Run

From repository root: `python3 -m http.server 4173` and open `http://localhost:4173/versions/v5-astra/`. Vanilla HTML, CSS and JavaScript. No runtime CDN, remote fonts, analytics, persistence, or form submission.

- `npm run check`: JavaScript syntax
- `npm run qa`: Chromium layouts, interactions, source dialogs, video lifecycle and fallbacks; expects the server to be running
- `VERBA_URL`, `VERBA_CHROMIUM`, `VERBA_QA_OUTPUT` override defaults
- `VERBA_WEBKIT=1` also tests WebKit when its binary is installed
- `?render=s01` exposes a deterministic full-scene render; `window.verbaFrame('s12')` selects another shot. The normal page always contains all 14 scenes. This render route is for design QA, not the animatic.

## Interaction and access

Native scrolling. Persistent scene navigation and accessible content dialogs. Details and sources remain in the document without JavaScript. Keyboard focus returns after closing a dialog; Escape and outside-click close it. The package is a controlled CSS two-face object with a cancellable, four-step reading sequence. Clinical factors change around one identical portrait; no diagnosis is inferred from appearance. Habits and practice checks exist only in memory for the current page visit.

Reduced motion and Save-Data start with still images and do not assign ambient video sources. Motion stops outside the viewport, in hidden documents, with a manual pause and in dialogs. Failed autoplay retains a poster. The original 26-second animatic remains a user-initiated, explicitly labelled separate item at `assets/animatic.mp4`. The completed silent foyer edit is `assets/foyer-loop.mp4`; it is a distinct 26-second film and must never be labelled as the animatic. The lifecycle statements here describe implementation contracts; final integrated runtime verification is recorded separately in `../../docs/ASTRA_V5_QA.md`.

## Art and science boundaries

The protagonist and doctor are generated fictional people, not VERBA staff, patients, or the lecturer. Scientific images are conceptual. S03 remains an explicitly labelled LDL cutaway with lipid cargo; it is never relabelled as a literal HDL particle. ApoB is a separate explanatory beat. TG is a different type of lipid, not a third cholesterol type. Fourteen days is a period of practice, not a laboratory-effect timeline. The material is educational and requires clinical editorial sign-off.

V4 is only a donor for `heart-loop.mp4`, `heart-poster.webp`, `olive-motion.mp4`, `olive-poster.webp`, the wordmark, and the scientific detail/source content. All new scenes and interactions live in this isolated version.

- [V5 art-direction brief](../../docs/ASTRA_V5_ART_DIRECTION_BRIEF.md)
- [V5 direction](../../docs/ASTRA_V5_DIRECTION.md)
- [V5 scene map](../../docs/ASTRA_V5_SCENE_MAP.md)
- [V5 motion storyboard](../../docs/ASTRA_V5_MOTION_STORYBOARD.md)
- [V5 animatic board](../../docs/ASTRA_V5_SHOWREEL_BOARD.md)
- [Scientific source audit](../../docs/V4_SCIENCE_AUDIT.md)

## One-shot scene motion

Four accepted generated clips are integrated using `data-ambient data-playback="once"`:

| Scene | File | Accepted length | Static image / motion poster |
|---|---|---:|---|
| S01 | `assets/s01-hero-motion-web.mp4` | 5.000 s | Master still / safe-crop motion poster |
| S03 | `assets/s03-lipoprotein-motion-web.mp4` | 2.000 s | Labelled LDL still / labelled motion poster |
| S06 | `assets/s06-hepatic-motion-web.mp4` | 3.000 s | Hepatic concept still / labelled motion poster |
| S14 | `assets/s14-salad-motion-web.mp4` | 5.000 s | `assets/s14-salad-serving.webp` |

Each is forward-only: one play when eligible and visible, then endpoint hold and explicit replay. No human-action loop, ping-pong or automatic replay on re-entry is intended. Replay remains subject to reduced motion, Save-Data and the manual motion switch. Completed clips retain completion across scrolling, dialogs and manual pause; a system static-mode change unloads the source and shows the still. Existing oil and vessel loops remain independent. These are implementation requirements, not a claim that the final browser integration already passed every runtime case.

S01's constant crop excludes uncertain lower-board props. S03 uses only 0–2 s before the cutaway rotates away; S06 uses 0–3 s before the late tight crop. Scientific captions remain visible. All four depict generated fictional/editorial imagery, not documentary footage or validated molecular simulation. The full four-clip package consumed the approved 240-credit cap; no further generation is authorized.

## Review package

The four direction/storyboard documents are `ASTRA_V5_DIRECTION.md`, `ASTRA_V5_SCENE_MAP.md`, `ASTRA_V5_MOTION_STORYBOARD.md` and `ASTRA_V5_SHOWREEL_BOARD.md`. The asset register, scientific addendum, original source audit and QA report explain source provenance and limitations.

`renders/final/contact-sheet-14-current.jpg` is the new current 14-scene browser sheet, including salad-serving S14. The three current anchors in `renders/final/` are native 1180×757 captures from exact commit `274aae663d346546b1649712d90958f498706bf4`; they are not upscaled 1920×1080 renders. The later pointer-events replay fix changes no visual layout. Original 1920×1080 approved direction anchors (`renders/s01-anchor.jpg`, `s03-anchor.jpg`, `s12-anchor.jpg`) are preserved separately; minor historical cursor marks remain. The earlier courtyard contact sheet remains archival. Film files, complete web source and raw generation records are maintained separately from the document-and-JPG review ZIP.
