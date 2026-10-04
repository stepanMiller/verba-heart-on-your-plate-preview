# VERBA V5 — QA and delivery status

04.10.2026 · creative prototype, not production-final or clinically approved.

## Verified

- Exact requested branch only: `astra/v5-human-cinematic-reboot-2026-10-04`. No merge to main, no Yandex publication.
- Three anchor images generated, revised, pixel-inspected and composed at 1920×1080. Direction approved by user before full expansion.
- Four required direction/storyboard documents, asset register and scientific addendum exist.
- Exactly 14 ordered scenes, no duplicate IDs, no broken local anchors; all source asset paths resolve locally.
- JavaScript and QA-script syntax checks pass; CSS delimiters/strings and runtime selectors audited.
- All 14 actual scene renders captured in the cloud browser after image decode, at 1180×757 and through an exact 1920×1080 review viewport. No horizontal overflow, all expected images loaded.
- S03 carrier/cargo/ApoB interaction; four science-source links in detail; Escape closes source dialog and returns focus.
- S09 all four fields and repeated front/back flip function. Back typography is native and readable, without generated nutrition numbers.
- S10 all three clinical contexts function while the identical portrait src remains unchanged.
- All three doctor questions function; initial question exactly «Каков мой общий сердечно-сосудистый риск?».
- Habit selection and day mark function in the current page state.
- Separate 5 s S03 motion study and 26 s animatic each loaded and completed in browser. Close pauses playback and returns focus. Source switching shows the correct title, caption and media URL.
- Both MP4 files decoded completely via FFmpeg; FFprobe verified expected duration, frames, H.264/yuv420p and silent audio status. Remote Git blob SHA matches the full26s local file.

## Environment limits / not claimed

Local Chromium launch failed with `socket() EPERM`; one approved retry confirmed the same restriction. No security or sandbox bypass was used. Cloud browser rendered the exact-SHA GitHub preview after the user approved the service's External Content Notice.

The full scripted 84-view Playwright suite, WebKit, physical Safari/iOS, OS reduced-motion switching, Save-Data emulation, no-JavaScript execution and 200% text enlargement have not been run in this restricted executor. The implementation contains those fallbacks and the reproducible script tests them, but code inspection is not equivalent to a passing runtime test.

The 26 s file had a slow first CDN load in the cloud browser; it ultimately reached duration 26/readyState 4/currentTime 26. Native Library copies provide independent delivery of the completed files.

## Scientific / creative limits

The LDL artwork is an explicitly labelled conceptual editorial cutaway, not a molecular model. Fibre/liver visuals are conceptual and nonquantitative. No personal measurements, therapeutic guarantee or diagnosis is inferred. Clinical sign-off is still required before public medical use.

Human motion in the animatic is optical camera movement over still references. Oil/vessel footage and controlled package turn provide actual movement. S03's 5 s study is a masked 2D optical composite, not a 3D reconstruction or generative image-to-video. Any paid natural-motion test requires separate scope/credit approval.

## Deliverables

`versions/v5-astra/` contains the high-fidelity prototype, independent film player, source stills, deterministic capture route, responsive review harness, reproducible motion renderers and QA script. `renders/VERBA-V5-contact-sheet.jpg` is the 14-scene contact sheet. `renders/s01-anchor.jpg`, `s03-anchor.jpg`, `s12-anchor.jpg` are the large anchor renders. All scientific references remain available in page details and source documents.

## Mobile revision — verified after the rebuild

Review commit: `7e217a9448a9f632e41fbfbd0fccf73f6e6d5017`.

The rejected mobile layout was replaced with a vertical editorial flow: heading, image, explanation and controls occupy separate readable areas. The desktop composition remains independent. All navigation, play, rotate, external-link and close icons are inline SVG.

- All 14 scenes inspected at 390×844 and 320×780 in exact-size browser iframes; no horizontal overflow. Linux scrollbars reduce document content width to 375/305px, making the check slightly narrower than the nominal frame.
- Every visible scene button was measured at least 44px high; principal tabs, arrows, question selectors and practice cells are 48px or larger.
- First-screen hero includes the protagonist's face; S03 keeps image and controls separate; S12 shows the complete consultation before its question.
- Fixed-header anchor offset verified, including S14 at 320px. No heading hidden behind the header after native section navigation.
- Mobile S03 preview modal opened and closed, scientific details opened and closed via Escape, four source links present, and motion control verified in both on/off states using actual pointer input.
- Landscape 844×390 tested as a vertically scrolling layout, without horizontal overflow.
- Whitespace retained where editorial line breaks are hidden, preventing joined words in mobile copy.

Artifacts: `renders/mobile/` and `renders/mobile/cloud-mobile-qa.json`. These are cloud Chromium checks, not physical iOS/Safari certification. Full scripted cross-browser/accessibility matrix remains not-run as described above.

## Paid-motion workflow is separate

The user approved four 5-second Gen-4.5 clips, maximum 240credits, one attempt each. Initial S01/S03/S06 jobs failed before video delivery because the reference URL host was unsupported. Account balance was 6491 before and 6491 after those three terminal failures. No net credit decrease was visible. Salad had not yet been submitted at that checkpoint. Official reference upload and explicitly authorized recovery are tracked separately in the motion package; no failed attempt is silently retried.
