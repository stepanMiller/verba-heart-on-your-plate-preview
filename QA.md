# Verification · 2 October 2026

Version: `codex/verba-scroll-film-20261002`.

## Verified

- `node --check app.js` passed.
- Static HTML inspection: ten continuous sections, one H1, no missing referenced local media. The reading flow does not require JavaScript.
- Chrome cloud browser: visual inspection of desktop hero, heart scene and mobile people section. Widths 320, 390, 430, 768, 1024 and 1280 were exercised with an iframe harness; document width matched available viewport width without horizontal overflow. The narrow frame has a desktop scrollbar, reducing its usable width by 15 px.
- At 430 px, increasing the root font size from 16 to 32 px did not create horizontal overflow after correcting title wrapping. This was a layout check, not a complete accessibility certification or a physical device zoom test.
- Both silent MP4 clips decoded and played in the browser (`readyState: 4`, `paused: false`, advancing current time). Both are 5.583 seconds. The initial incomplete human clip was replaced and retested before release.
- Global pause stopped both videos and set the paused page state. Resuming restored motion. Videos outside the viewport pause.
- Chapter menu opened and a chapter link navigated to `#s09`, closing the menu. Essential content remains in the accessibility tree as a continuous document.
- Selecting the native radio option “Чаще выбирать бобовые” updated the local first-step message. There is no form submission or remote persistence.
- Source disclosure opened and contained the five expected AHA, ESC/EAS and NHLBI links.
- Reduced-motion CSS and JavaScript were inspected: transitions/reveals are disabled, posters retained, and motion controls respect the device preference. Real OS preference switching was not exercised.
- Static preview source passed the same JavaScript syntax check, was packaged and published successfully as a separate private review page.

## Limits

Physical iPhone/iPad Safari testing has not been performed. Autoplay restrictions and data-saving modes intentionally fall back to poster images. Video loops are reused conceptual footage, not diagnostic images. The lecture still requires final medical review.

## Release isolation

The new commit uses the original main commit `7003095a18f456e4de7f53e3185cdfc09fbd2775` as parent. Only `codex/verba-scroll-film-20261002` is updated. No main merge, GitHub Pages configuration change or other agent branch change is part of this version.

Review URL: https://verba-scroll-film-20261002.spartak19876.chatgpt.site
