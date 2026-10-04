# VERBA Heart / Final integration priorities

Source: `328f7440f18ee30e3464af730467821acec1420e`, V5 Astra. Captured before implementation on 4 October 2026.

Initial viewer pass: all 14 scenes captured at 1440×936 and 390×844; seven viewport dimensions inspected; all S03, S04, S07, S09, S10, S12, S13 interactions exercised. All four approved one-shot videos completed and replayed; oil and vessel played and paused offscreen. Foyer film played to completion (26 seconds). Cloud Chromium also inspected the approved source. Baseline screenshots are temporary audit evidence, not new creative proposals.

1. **Science readability.** S03 cargo/TG/qualification lacks contrast against gold macro; S05 mechanism crosses textured highlights; S06 caption needs the same editorial scale. Stabilize local contrast without covering the hero.
2. **Continuity and type.** Preserve every scene's layout identity; connect ivory, warm highlights, olive and graphite. Raise peripheral type and regular controls to a consistent readable scale. Keep the protagonist and every medical statement unchanged.
3. **Motion rhythm.** Preserve S01/S03/S04/S06/S09/S11/S14 real motion. Keep S08 and S12 predominantly still; remove repetitive looping still-image animation. Avoid automatic changes while reading. Keep visual endpoint on once-only clips.
4. **Presentation UX.** Remove public animatic/prototype/production UI; keep internal records separately. Improve scene/keyboard navigation, replay placement, film focus return, native scrolling, tablet flow and mobile framing.
5. **Release QA.** Test every scene and interaction, six required dimensions plus tablet portrait, reduced-motion, Save-Data, blocked autoplay, no-JS, 200% text enlargement and media lifecycle. Preserve and inspect the existing foyer master; no paid generation.

Baseline layout checks passed 98 scene/viewport combinations. Original test runner's later secondary contexts crashed with a single-process local Chromium setting; this is a test-runtime issue and is not counted as product QA success. The final runner uses separate renderer processes.

No merge or production-domain publishing is authorized.
