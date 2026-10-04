# VERBA Heart / Final integration release

Source commit: `328f7440f18ee30e3464af730467821acec1420e`.
Working branch: `work/v6-final-integration-2026-10-04`.
Release route: `versions/v6-final/index.html`.

## Changes

- Preserved all 14 Astra compositions, the recurring protagonist, approved assets and scientific story. Added restrained shared ivory light, consistent olive/graphite hierarchy and local contrast for S03/S05/S06. Kept S03 as the principal science hero.
- Unified peripheral type, scientific qualifications, controls and touch sizes. S12 is a still conversation pause; S08 remains predominantly still. Removed repeating browser animation on human stills and science labels. Package states now advance only on deliberate input.
- Preserved native scrolling, added keyboard scene navigation, aligned arrow/contents behavior and kept controls separate from scene copy. Extended the existing readable mobile flow to tablet widths. At substantial text enlargement, the presentation switches to a sequential reading layout, preventing collisions between copy and mechanism/risk panels.
- Removed the public animatic selector, prototype labels and production wording. Public audience sees one final foyer film, details/sources, motion control and navigation. `?review` exposes the pending medical review status. AI-character and science-metaphor disclosure remains in the material notes.
- Ambient media loads only in the relevant viewport, pauses offscreen, in dialogs and on visibility lifecycle changes. Generated clips start automatically only when at least 35% of the video surface is visible. They retain their accepted endpoint for 2.2 seconds, then replay automatically while visible. Re-entry restarts the shot. This intentional replay replaces the initial V6 one-shot policy following explicit user feedback. Replay overlays were removed from the markup. Reduced motion, Save-Data, blocked-autoplay posters and no-JS content were checked.
- Finished the existing 26-second foyer master with a held VERBA/MILLER brand ending. Original sequence, imagery, crops, scientific captions and grade retained. No montage rebuild or new generation.

## Phone correction after review

The reference at https://verba-heart.website.yandexcloud.net/ uses complete phone scenes (`100svh`, minimum 620px). The first V6 reading layout stretched several scenes to 1150–1400px and put completed-shot replay overlays across the imagery. This was a presentation mismatch despite the mechanical QA pass.

The corrected phone layout uses the same approved V5 imagery and copy in complete compositions with a shared light field, meaningful crops, foreground type and compact navigation. At 390×844, all 14 scenes are 844px high. Very short screens use a 720px minimum to retain readable type and 44px controls; substantial text enlargement uses the reading layout. Landscape/tablet retain the readable flow. S03 keeps carrier/cargo, LDL/HDL, TG and ApoB states; the TG plate yields to the ApoB layer in that state.

Replay buttons and the separate S03 modal launch button were removed from public markup. One global motion control remains. The 26-second foyer film remains unchanged from the finished V6 master.

Evidence: `mobile-before-after-S03.jpg` and `mobile-final-S01-S03-S06.jpg`.

## Browser QA

Both **Chromium 153.0.8010.0** and **WebKit 26.5** passed:

| Viewport | Scenes per browser | Result |
| --- | ---: | --- |
| 320×640 | 14 | Pass |
| 390×664 | 14 | Pass |
| 320×780 | 14 | Pass |
| 390×844 | 14 | Pass |
| 844×390 | 14 | Pass |
| 768×1024 | 14 | Pass |
| 1024×768 | 14 | Pass |
| 1440×936 | 14 | Pass |
| 1920×1080 | 14 | Pass |

252 scene/viewport inspections and 47 functional checks passed. Final focused phone verification follows the last composition changes; see `phone-qa-results.json`. No page errors, missing local assets, horizontal overflow or tested clipped scene copy. Exact results: [`qa-results.json`](qa-results.json).

Checked all three S03 states, all four S09 labels and repeated package turns, all three S10 contexts with unchanged portrait, all three S12 questions, all S13 habits and reversible practice marks. Also checked source/contents/film dialogs, Escape and focus return, arrows, PageDown navigation, accepted 5/2/3/5-second shot completion, endpoint hold, automatic replay and re-entry, poster fallback, offscreen/modal pause and device policy changes.

All interactive states were also exercised at 320×780, 390×844, 844×390 and 1024×768. Touch target checks covered all scenes at mobile/landscape dimensions. 200% text enlargement was tested by doubling computed text sizes, checking both clipping and overlap in the editorial blocks in both engines. This is text-enlargement emulation, not a physical browser menu action.

Chromium additionally passed cold Save-Data/reduced-motion network checks, blocked-autoplay fallback, no-JavaScript scenes/details/source links and deterministic capture. Hidden-tab behavior was checked through simulated `document.hidden`/`visibilitychange` lifecycle; offscreen pause and dialog close were real browser actions. Film decoded and completed in both engines; FFmpeg full decode also passed.

The required agent-browser CLI was attempted but its daemon could not start in the isolated environment. Verification continued with direct Playwright over browser pipes and an in-process local HTTP server. Cloud Chromium inspected the approved source and the immutable release separately.

## Medical review record

**Substantive scientific changes: 0.** All on-scene scientific paragraphs, S01–S13 medical detail/source markup and interactive scientific copy were compared with V5 and remained identical. See [`medical-change-record.json`](medical-change-record.json). Editorial changes are limited to production wording, S09 mockup labels, S12 footer and about-material/review-status routing.

Medical approval is still pending. This pass is not a fresh expert review of the inherited claims or external medical source pages.

## Film

[`../assets/foyer-film.mp4`](../assets/foyer-film.mp4), 26 seconds / 624 frames / 24 fps / 1280×720 / H.264 yuv420p / silent / fast-start.
The V5 master is retained through frame 611; its brand image is held for the final 12 frames instead of dissolving back to the opening. Original V5 film and animatic unchanged. Ending/crop/credit evidence: [`foyer-ending.jpg`](foyer-ending.jpg), [`foyer-qc.json`](foyer-qc.json).

## Open issues and limits

- Medical sign-off remains required before final clinical/public release.
- Physical Safari on macOS, actual iPhone/iPad hardware, browser-menu text zoom and projector testing were not performed. Automated WebKit is useful compatibility evidence, not physical-device certification.
- External medical source pages were retained and were not substantively revalidated in this integration pass.
- The supplied generated clips and CGI retain their approved intrinsic limitations; no attempt was made to change faces, anatomy, generator or model.

No known blocker remains in the tested review experience. No merge, final-domain deployment or production publication was performed.

## Production record

Additional paid generation: **0**. Runway credits: **0**. New generative assets: **0**. New offline film finishing: **1**. Asset reference/casting/model changes: **0**. Final approved asset directory edits: **0**.

Final contact sheet: [`VERBA_Heart_V6_14_scene_contact_sheet.jpg`](VERBA_Heart_V6_14_scene_contact_sheet.jpg). Captures use the final V6 render route, approved stills and 1440×936 geometry, with navigation hidden for composition review.
