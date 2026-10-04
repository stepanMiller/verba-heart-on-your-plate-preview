# VERBA — four-shot motion package for a silent foyer film

Prepared 04.10.2026, rate/availability rechecked 14:10 UTC. **Execution update at 14:29 UTC: the four-shot/240-credit package was explicitly approved. One S14 human-motion clip has succeeded (60 net credits). Three source-host failures remain un-retried pending explicit recovery permission. The separate foyer edit is approved in scope but not yet assembled.**

## One bounded approval

- Model: `gen-4.5`, standard 720p, silent image-to-video
- Duration: 5 seconds per generated clip
- Count: exactly four clips, one attempt each
- Rate: 12 Runway credits per second
- Per-clip ceiling: 60 credits
- **Combined hard ceiling: 240 credits**
- The earlier unapproved 60-credit S03 proposal is included as clip 3, not a fifth charge
- No automatic retry, substitute model, regeneration, audio generation or paid upscaling
- Failed or ambiguous submission: establish its status before any further action; never silently resubmit
- All four source references are exact visually verified images, now also uploaded through the official Runway file route and byte-checked. Salad reference: `s14-salad-serving.webp`

Official current sources:
- https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5
- https://academy.runwayml.com/models-pricing

Read-only connection check confirms Gen-4.5 remains available without a reported deprecation or plan block. The renderer does not have a credit-budget parameter, so the bound must be enforced by exactly four distinct submissions after explicit combined approval.

## Four clips

| Clip | Reference | Motion | Acceptance criteria |
|---|---|---|---|
| 1 · Human living hero | `versions/v5-astra/assets/s01-master-casting.webp` | Quiet natural breathing, an almost imperceptible pause of gaze, tiny resting-hand movement, restrained camera presence | Same heroine, age, face, hairstyle, clothes, room and breakfast; fingers/food/props stable; no advertising smile or new action |
| 2 · Salad-serving ending | `versions/v5-astra/assets/s14-salad-serving.webp`, visually checked and byte-verified after official upload; same heroine/table/light/wardrobe | One simple controlled placement of a salad bowl with both hands, then hands come to rest | Anatomically coherent hands, bowl stays rigid and supported, no slipping through the table, no spilling/multiplying food, no newly invented utensils; recognizably the master heroine |
| 3 · Lipoprotein | `versions/v5-astra/assets/s03-lipoprotein-cutaway.webp` | Whole conceptual carrier drifts gently, with a minimal few-degree turn while the cutaway continues facing the viewer | Silhouette, fixed cutaway, shell and cargo stable; no rupture, widening, released gold, HDL transformation or new particles; maintain conditional science caption in final composite |
| 4 · Liver macro | `versions/v5-astra/assets/s06-hepatic.webp` | Nearly locked camera with slight optical perspective change and quiet existing-light variation | Organ geometry/lobes remain fixed; no heartbeat-like pulsing, direct sugar-to-fat morph, invented outgoing lipid stream, damaged tissue or predicted blood-test result |

## Ready prompts, to use only after approval

### 1 · Living hero

A quiet observed moment at the table. The woman breathes naturally, with a very small relaxed movement of her resting hands and a subtle pause of her gaze toward the window. Preserve the exact woman, age, face, hair, wardrobe, breakfast, hands, table and room from the starting image. Her expression remains thoughtful and natural. The bowl and food remain in their original positions. Almost locked camera, warm natural daylight, one calm continuous shot.

### 2 · Serving ending — verified reference, successful first generation

The same woman slowly places the salad bowl onto the table in one simple controlled action with both hands, then her hands settle naturally beside the bowl. The bowl remains rigid, supported and physically coherent throughout. Preserve her exact identity, face, hairstyle, wardrobe, hands, room, table, food and the direction of daylight from the starting image. Nearly locked camera. A calm everyday gesture, followed by a quiet resting moment. One continuous forward-moving shot.

This prompt must be adjusted to the actual approved starting pose; do not request a placement if the reference already depicts an unsupported or completed conflicting action.

### 3 · Lipoprotein

Locked camera. The single conceptual lipoprotein particle floats slowly in the surrounding fluid with gentle whole-object drift. It makes a minimal turn of only a few degrees while its existing cutaway section stays fixed and faces the camera. The original silhouette, shell, protein band and visible interior remain stable. All golden lipid contents stay contained in their original locations inside the core. Preserve the composition, materials, colors, lighting and conceptual scientific geometry. One calm continuous forward-moving shot.

### 4 · Liver macro

A quiet cinematic macro of the same liver concept. The camera makes an extremely small slow lateral movement while the existing warm light moves subtly over its surface. Preserve the complete original organ silhouette, lobes, surface and internal light design. The liver remains stationary and structurally stable. This is a restrained conceptual view of the organ, without any new particles, outputs, transformations or visible change of tissue. One calm continuous shot.

## Tool fields

`mcp__codex_apps__runway_generate_video` with explicit `model: "gen-4.5"`, `duration: 5`, `ratio: "16:9"`, `startFrame: {url: exact_verified_reference_url}`, `promptText` and short rationale. There is no project ID to configure; the connected workspace is already pinned. Omit `endFrame`, `referenceVideo`, `referenceImages`, `generateAudio` and resolution override. Standard generation is the quoted 720p; no native 1080p is promised.

## Foyer edit structure — scope approved, remaining clips pending

Use seven motion-led source shots and a closing brand hold; leave the still-based fibre/kitchen/consultation passages in the full 14-topic web presentation:

| Edit time | Length | Shot |
|---|---:|---|
| 00:00–00:04.5 | 4.5 s | New living hero |
| 00:04.5–00:08.5 | 4 s | New floating LDL |
| 00:08.5–00:10 | 1.5 s | Existing real oil footage |
| 00:10–00:14 | 4 s | New liver macro |
| 00:14–00:17 | 3 s | Existing native controlled package turn |
| 00:17–00:20 | 3 s | Existing real vessel CGI |
| 00:20–00:24.5 | 4.5 s | New salad-bowl placement |
| 00:24.5–00:26 | 1.5 s | Brand hold, continuing marks already visible over the ending |

This is a complete 26-second alternative cut, not a silent replacement of the existing ten-shot animatic. Parent confirmed this edit scope is within the latest user request. Keep the existing ten-shot animatic separate; assemble a new foyer master only after the needed clips pass QA.

For a foyer, titles should be short and approximately 42–48 px at 720p, held around three seconds where possible. Meaning cannot depend on voice or sound. Science captions remain visible and clear; don't turn them into microscopic boilerplate. VERBA + «Медицинский курорт» and the authentic MILLER mark + smaller Visual Production stay distinct.

Loop the **complete edit**, never an individual human action. Prefer compatible table framing/daylight between hero and bowl-ending, with a brief controlled editorial transition through the warm brand hold into the opening. Do not ping-pong, reverse pouring or a human gesture, or ask Gen-4.5 for an unsupported end-frame constraint. The loop transition will be checked on two consecutive complete cycles after the actual clips exist.

## Current actual state and cost

- Before three public-source submissions: 6,491 credits
- S01/S03/S06: all terminal FAILED with “URL hostname is not in allowed hostnames”; no output; no retry
- After those three failures: 6,491 credits, net decrease 0
- Official same-image uploads: completed and byte-identical; no generation in upload steps
- S14 first attempt via Runway-hosted reference: SUCCEEDED, task `3936a1e8-9f77-4b47-9412-e6159d7bc492`; one generated human-motion clip passed draft QA
- Current observed balance: 6,431 credits; net spend 60; 180 remains of the approved 240 cap
- **Three recovery submissions require separate explicit permission due to the one-attempt constraint. None has been made**
- Raw S14: `versions/v5-astra/assets/s14-salad-motion.mp4`, measured 5.041667 s / 121 frames
- Web S14: `versions/v5-astra/assets/s14-salad-motion-web.mp4`, exactly 5.000 s / 120 frames, 1280×720 / 24 fps, H.264/yuv420p, fast-start, silent, forward only
- QA: `versions/v5-astra/renders/foyer-motion-qa/s14-QA.json`; cost ledger: `credit-ledger.json` in the same folder

Transport URLs and raw connector responses are excluded from public provenance. Source/clip hashes, task IDs, prompts, exact model/duration, status and actual balances are retained.
