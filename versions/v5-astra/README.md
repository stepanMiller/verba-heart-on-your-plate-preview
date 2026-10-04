# VERBA V5 · Внутри обычного дня

High-fidelity creative prototype. One recurring fictional woman, 14 individually composed scenes: ordinary life → inside lipid transport → a consultation → ordinary life. This is an art-direction review, not a production-final lecture or final film.

## Run

From repository root: `python3 -m http.server 4173` and open `http://localhost:4173/versions/v5-astra/`. Vanilla HTML, CSS and JavaScript. No runtime CDN, remote fonts, analytics, persistence, or form submission.

- `npm run check`: JavaScript syntax
- `npm run qa`: Chromium layouts, interactions, source dialogs, video lifecycle and fallbacks; expects the server to be running
- `VERBA_URL`, `VERBA_CHROMIUM`, `VERBA_QA_OUTPUT` override defaults
- `VERBA_WEBKIT=1` also tests WebKit when its binary is installed
- `?render=s01` exposes a deterministic full-scene render; `window.verbaFrame('s12')` selects another shot. The normal page always contains all 14 scenes. This render route is for design QA, not the animatic.

## Interaction and access

Native scrolling. Persistent scene navigation and accessible content dialogs. Details and sources remain in the document without JavaScript. Keyboard focus returns after closing a dialog; Escape and outside-click close it. The package is a controlled CSS two-face object with a cancellable, four-step reading sequence. Clinical factors change around one identical portrait; no diagnosis is inferred from appearance. Habits and practice checks exist only in memory for the current page visit.

Reduced motion and Save-Data start with still images and do not assign ambient video sources. Motion stops outside the viewport, in hidden documents, with a manual pause and in dialogs. Failed autoplay retains a poster. The 26-second animatic is user-initiated and explicitly labelled as an animatic. Its source is `assets/animatic.mp4`.

## Art and science boundaries

The protagonist and doctor are generated fictional people, not VERBA staff, patients, or the lecturer. Scientific images are conceptual. S03 remains an explicitly labelled LDL cutaway with lipid cargo; it is never relabelled as a literal HDL particle. ApoB is a separate explanatory beat. TG is a different type of lipid, not a third cholesterol type. Fourteen days is a period of practice, not a laboratory-effect timeline. The material is educational and requires clinical editorial sign-off.

V4 is only a donor for `heart-loop.mp4`, `heart-poster.webp`, `olive-motion.mp4`, `olive-poster.webp`, the wordmark, and the scientific detail/source content. All new scenes and interactions live in this isolated version.

- [V5 art-direction brief](../../docs/ASTRA_V5_ART_DIRECTION_BRIEF.md)
- [V5 direction](../../docs/ASTRA_V5_DIRECTION.md)
- [V5 scene map](../../docs/ASTRA_V5_SCENE_MAP.md)
- [V5 motion storyboard](../../docs/ASTRA_V5_MOTION_STORYBOARD.md)
- [V5 animatic board](../../docs/ASTRA_V5_SHOWREEL_BOARD.md)
- [Scientific source audit](../../docs/V4_SCIENCE_AUDIT.md)
