# VERBA Heart / V6 final integration

Review release built from Astra V5 at `328f7440f18ee30e3464af730467821acec1420e`.

- Presentation: `index.html`
- Internal review status: `index.html?review`
- Deterministic scene capture: `index.html?render=s01` through `s14`
- Final standalone foyer film: `assets/foyer-film.mp4`
- Final contact sheet and verification evidence: `review/`

The V5 directory and approved source branch are unchanged. All human/science stills, approved one-shot clips and donor videos are referenced from V5/V4. V6 adds integration CSS, an enlarged-text reading fallback and media/navigation finishing. No new visual direction, protagonist, generated asset, paid call or Runway credit.

The standalone film preserves the V5 montage through frame 611 and holds the existing VERBA/MILLER ending for the final 12 frames. 26 seconds, 624 frames, 24 fps, 1280×720, H.264, silent. The original looping master and animatic remain internal V5 artifacts.

Run `npm run check` and `npm run qa` after installing the declared Playwright dependency. The QA wrapper starts its own static HTTP server. `VERBA_CHROMIUM` can select an installed Chromium executable. `VERBA_WEBKIT=1` enables WebKit; optional `VERBA_WEBKIT_ROOT`, `VERBA_WEBKIT_LIBS`, `VERBA_GST_PLUGINS` and `VERBA_GST_SCANNER` support a locally installed Linux WebKit runtime. See `review/RELEASE-REPORT.md` for exact tests and limits.

This is a review release. Medical approval is pending. Do not merge or publish to a final production domain as part of this pass.

Phone correction: complete phone compositions, automatic forward replay with a 2.2-second endpoint hold, no replay overlay. Run `npm run qa:phone` for focused final phone checks. See `review/RELEASE-REPORT.md`.
