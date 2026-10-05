# Separate finishing review — 2026-10-05

Base: `31526bd24277c0913dd7d21315c5779296883132`.
New route: `versions/v6-finishing-review/`. Original route and assets remain untouched.

## Targeted changes

- S01: replaced conspicuous artificial mouthing with the approved still. The film uses its calm accepted opening frame for the same five-second shot; this is an intentional still fallback, not newly generated human motion.
- S02: influence labels increase to 16px on desktop and 12px on phones, with stronger solid-ivory contrast and more padding.
- S03: one explanatory panel follows the selected carrier/cargo/ApoB state. Existing clinical wording is retained. The accepted 0–2-second cutaway is retimed into a six-second eased forward/back cycle. No later hidden-core frames are used.
- S04: oil video is unchanged.
- S05: optional eight-second subtle optical deformation affects the existing gel texture; oats/lower surface stay fixed. It remains an intestinal viscosity metaphor, not an artery or LDL trap, and not a physiological simulation.
- S06: the accepted 0–3-second liver view is retimed into an eight-second eased forward/back cycle. No late tight crop is used.
- S11: freshly extracted from the original review master, exact 8.8–14.8 seconds, top crop 910×400, native 30fps. No baked subtitles. This reduces derivative losses; the 910×512 source cannot provide genuine Full HD detail. The film also uses the cleaner source excerpt, converted to its established 24fps.
- Typography: original Yandex lecture system-sans/light-serif stacks, 400-weight heading style and −.047em tracking, mono eyebrows/captions, and desktop lead rhythm. Existing compositions retained. Source-level evidence is in `finishing/typography-evidence.md`; actual platform font selection depends on installed fonts.
- S14: removed MILLER from the final presentation slide. The film keeps VERBA and moves the authentic MILLER mark to a 94px-wide lower-right credit. Same 26-second shot order/timing, no new scenes.

## Verified

- JavaScript syntax checks passed
- 14 scenes; all headlines/leads and 14 source-detail blocks unchanged
- Local asset references resolve
- Original v6-final has no git changes
- All five output videos fully decode without FFmpeg errors
- Film: 26 seconds, 624 frames, 24fps, native 1280×720, H.264, silent
- Contact-sheet/frame inspection: calm hero, accepted science frames, S11 subtitle-free crop, VERBA ending with tiny MILLER credit
- Eased loop boundary differences recorded in `finishing/loop-boundaries.json`

## Outstanding

Local Chromium could not start: socket() returned Operation not permitted.
No browser or security restriction was bypassed. This is not a passed browser
review. Desktop rendered layout/interaction verification is pending on the
separate preview; mobile emulation and physical iPhone/Safari are unverified.
No inherited browser screenshots or old QA results are presented as new evidence.
Clinical sign-off is still required before production publication.

Paid generation/upscale: 0. Production deployment: none. Main merge: none.
