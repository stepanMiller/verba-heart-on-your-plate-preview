# Verification · version 2 · 2 October 2026

- `node --check app.js` passed.
- HTML inspection found six main sections, one H1 and no missing linked local assets.
- Cloud Chrome: desktop opening and cooking scene inspected visually. Narrow mobile hero and ingredient layout inspected.
- Widths 320, 390, 430, 768 and 1024 were exercised in the responsive iframe. Document width matched the viewport. Desktop width 1348 also matched. Transformed decorative hero media remains clipped inside its container.
- At 430 px, root font size increased from 16 to 32 px without horizontal overflow. This is a root-font layout check, not a complete accessibility certification or physical-device zoom test.
- Cooking MP4 duration 12.5 seconds; decoded and played (`readyState: 4`, advancing current time, `paused: false`). ffprobe also validated duration and container. Poster exists.
- Global pause stopped the video and set the page's paused state.
- The chapter menu navigated to the food section. Scrolling to the vegetables/legumes step updated the ingredient caption correctly.
- Selecting “Чаще выбирать бобовые” updated the local first-step message.
- No slide pagination or intercepted wheel/touch scrolling. Essential reading remains available without JavaScript; only additional medical explanation and sources use native disclosures.
- Reduced-motion behavior inspected in source. Real OS preference changes were not tested.

Physical iPhone/iPad Safari checks were not performed. Autoplay and data-saving restrictions intentionally retain posters. The lecture still requires final medical review.

Source branch: `codex/verba-scroll-film-20261002`. Source commits are uploaded through GitHub's Git API with fast-forward-only updates to that branch. Review hosting is separate; GitHub Pages settings and main are not changed by this agent.
