# Verification · version 3 · 2 October 2026

- `node --check app.js` passed.
- HTML inspection found six main sections, one H1 and no missing linked local assets.
- Layout and interaction checks below were completed for version 2. Version 3 changes only the routine video, poster, centered crop and media provenance.
- Widths 320, 390, 430, 768 and 1024 were exercised in the responsive iframe. Document width matched the viewport. Desktop width 1348 also matched. Transformed decorative hero media remains clipped inside its container.
- At 430 px, root font size increased from 16 to 32 px without horizontal overflow. This is a root-font layout check, not a complete accessibility certification or physical-device zoom test.
- Version 3 montage: silent H.264, 960 × 720, 24 fps, duration 11.625 seconds, 734190 bytes. ffprobe and full ffmpeg decode passed. New poster exists. Cloud Chrome desktop and a 390 px responsive iframe both played the montage (`readyState: 4`, advancing current time, `paused: false`); the new crop was inspected visually. Mobile document width matched its available viewport, 375 px with scrollbar.
- Global pause stopped the video and set the page's paused state.
- The chapter menu navigated to the food section. Scrolling to the vegetables/legumes step updated the ingredient caption correctly.
- Selecting “Чаще выбирать бобовые” updated the local first-step message.
- No slide pagination or intercepted wheel/touch scrolling. Essential reading remains available without JavaScript; only additional medical explanation and sources use native disclosures.
- Reduced-motion behavior inspected in source. Real OS preference changes were not tested.

Physical iPhone/iPad Safari checks were not performed. Autoplay and data-saving restrictions intentionally retain posters. The lecture still requires final medical review.

Source branch: `codex/verba-scroll-film-20261002`. Source commits are uploaded through GitHub's Git API with fast-forward-only updates to that branch. Review hosting is separate; GitHub Pages settings and main are not changed by this agent.
