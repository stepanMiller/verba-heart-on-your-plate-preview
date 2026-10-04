# VERBA — four-shot motion package for a silent foyer film

Completed 04.10.2026, updated 14:51 UTC. **All four clips succeeded within the approved 240-credit net cap. Three hostname failures were explicitly authorized for one recovery each; no further retries. Accepted motion ranges are now rendered into the separate 26-second silent foyer film. The original ten-shot animatic is unchanged.**

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

## Production motion briefs retained for review (completed package)

### 1 · Living hero

A quiet observed moment at the table. The woman breathes naturally, with a very small relaxed movement of her resting hands and a subtle pause of her gaze toward the window. Preserve the exact woman, age, face, hair, wardrobe, breakfast, hands, table and room from the starting image. Her expression remains thoughtful and natural. The bowl and food remain in their original positions. Almost locked camera, warm natural daylight, one calm continuous shot.

### 2 · Serving ending — verified reference, successful first generation

The same woman slowly places the salad bowl onto the table in one simple controlled action with both hands, then her hands settle naturally beside the bowl. The bowl remains rigid, supported and physically coherent throughout. Preserve her exact identity, face, hairstyle, wardrobe, hands, room, table, food and the direction of daylight from the starting image. Nearly locked camera. A calm everyday gesture, followed by a quiet resting moment. One continuous forward-moving shot.

This prompt must be adjusted to the actual approved starting pose; do not request a placement if the reference already depicts an unsupported or completed conflicting action.

### 3 · Lipoprotein

Locked camera. The single conceptual lipoprotein particle floats slowly in the surrounding fluid with gentle whole-object drift. It makes a minimal turn of only a few degrees while its existing cutaway section stays fixed and faces the camera. The original silhouette, shell, protein band and visible interior remain stable. All golden lipid contents stay contained in their original locations inside the core. Preserve the composition, materials, colors, lighting and conceptual scientific geometry. One calm continuous forward-moving shot.

### 4 · Liver macro

A quiet cinematic macro of the same liver concept. The camera makes an extremely small slow lateral movement while the existing warm light moves subtly over its surface. Preserve the complete original organ silhouette, lobes, surface and internal light design. The liver remains stationary and structurally stable. This is a restrained conceptual view of the organ, without any new particles, outputs, transformations or visible change of tissue. One calm continuous shot.

## Production format

Four approved five-second Gen-4.5 image-to-video outputs, 16:9, standard 720p and silent. No audio generation, paid upscale or alternate model was used. The approved package is complete and its cap is fully consumed; these retained specifications are not authorization for another generation.

## Final foyer edit and accepted ranges

Master: `versions/v5-astra/assets/foyer-loop.mp4`. Reproduction: `python versions/v5-astra/tools/render-foyer-loop.py`.

| Edit time | Length | Accepted source |
|---|---:|---|
|00:00–00:05|5s|S01 motion, constant 16:9 crop `(96,0)–(1168,603)` excludes uncertain low-board props|
|00:05–00:07|2s|S03 first 0–2s only, with conceptual-LDL caption|
|00:07–00:08.5|1.5s|Existing moving oil donor|
|00:08.5–00:11.5|3s|S06 first 0–3s only, before stronger late camera cropping|
|00:11.5–00:16|4.5s|Native controlled package turn/label attention|
|00:16–00:19.5|3.5s|Vessel CGI donor, source 1.5–5s, no therapeutic before/after|
|00:19.5–00:24.5|5s|Same heroine places salad; forward action only|
|00:24.5–00:26|1.5s|Warm brand hold, last 12 frames dissolve to exact opening frame|

The later S03 turn hides the cutaway; it is preserved in the raw review file but not used in the film or explanatory web clip. S06 later macro crop is also excluded. S01 mouths slightly; editorial titles are not presented as synced dialogue. The lower-board reframe avoids uncertain newly revealed props.

Foyer primary titles are 45 px at 720p, concise and independent of sound. Science caveats are 25/22 px. Genuine VERBA + «Медицинский курорт» and exact official-site MILLER + smaller Visual Production stay separate. The creator area receives a soft light field for contrast.

Looping applies to the **whole 26 s edit**, not individual generated actions. No reverse, ping-pong or forced individual loop. The raw first/last composite frames match exactly before encoding. Two complete encoded cycles, 52 s / 1248 frames, fully decode. The decoded endpoint comparison records only small compression differences; see `foyer-QA.json`.

## Final task-only credit accounting

- Approved task cap: 240 Runway credits
- Initial three public-source failures: 0 net credits
- Successful first S14 attempt: 60 credits
- Explicitly authorized single recovery for each of S01/S03/S06: 180 credits total
- **Actual task net spend 240; remaining task budget 0**
- No further retries, paid edits, audio or upscaling
- Account-wide before/after balances were verified privately; they are excluded from public project provenance

Successful tasks:
- S01 `8988bbc0-8499-4b08-87a6-727446530b6d`
- S03 `f4cf4668-d528-4a6b-a3b2-939d133ad1f3`
- S06 `61228348-bc2d-4e21-b01f-69b9968f2f1c`
- S14 `3936a1e8-9f77-4b47-9412-e6159d7bc492`

Raw source files are 5.041667 s / 121 frames. Web derivatives are S01 5.000s, S03 2.000s, S06 3.000s, S14 5.000s; all 1280×720 / 24 fps, H.264/yuv420p, fast-start, silent. Exact paths, hashes and sizes: `versions/v5-astra/renders/foyer-motion-qa/web-derivatives.json`.

Transport URLs and raw connector responses are excluded from public provenance. Safe IDs, local filenames, prompts, model/duration, status, task-only cost observations and hashes are retained. The four images were byte-verified after official upload. Independent source-clip QA and final-frame checks remain alongside the ledger.
