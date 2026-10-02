# VERBA / Heart on your plate / Scroll film

## Brief and authority

Internal MILLER production comparison requested by the user on 2 October 2026. The user authorized a complete redesign, shorter text, human imagery, video, animation and ordinary vertical scrolling, with GitHub changes on a separate branch. This is a review version; no final medical approval or production launch is claimed.

Canonical source: main at `7003095a18f456e4de7f53e3185cdfc09fbd2775`.
Branch: `codex/verba-scroll-film-20261002`.
Main and other agents' branches are outside this change.

## Narrative thesis

Care for the heart combines everyday dietary habits, the person's overall cardiovascular context and decisions made with a doctor.

Audience: adults reading the educational lecture independently, especially on a phone. Assumed viewing context: a short, self-paced read. Desired action: understand the principles, prepare three questions for a doctor, choose one achievable habit.

## Narrative blueprint / storyboard

| Chapter | Message | Visual and interaction |
| --- | --- | --- |
| Opening | Heart on your plate | Large editorial title; moving human portrait from an existing MILLER film |
| Silence | Cholesterol can rise without obvious symptoms | Cropped existing heart film; short text; no numerical risk estimates |
| Personal context | The same LDL can mean different risk | Two fictional people from the original draft; four visible factors |
| Analysis | LDL goals are individual | Three lipid indicators, hierarchy and optional explanation |
| Everyday food | Repeated choices matter | Food photography; four principles revealed by scrolling |
| Replacements | Replace part of a habitual food | Original fat comparison photograph; three visible substitutions |
| Packaging | Compare composition and the same quantity | Educational label without invented nutrition values |
| Treatment | Diet and indicated treatment work together | Typographic pairing; essential treatment statement visible |
| Personal action | Ask three questions; choose one habit | Accessible radio options and a local, unsent choice |
| Closing | Care continues at home | Short ending; sources and media provenance in disclosures |

Content hierarchy: essential messages and safety statements remain visible. Supporting explanations and source references use native details. Repeated scene notes, pagination, movement OFF and animation-dialog scaffolding are removed.

## Visual direction

The original VERBA palette and serif/sans hierarchy remain the starting point. The new review direction adds forest-green cinematic sections, edge-to-edge imagery, human portraits, large typography and contrasting editorial spacing. Fonts: Playfair Display and Manrope, self-hosted with OFL licenses. This direction was selected under the user's redesign request; it has not received a separate visual approval.

Motion: no wheel, touch or keyboard scroll interception; short muted video loops; one scroll-led food composition; gentle reveals; scroll progress. Mobile uses a continuous document with shorter media areas. Reduced motion, a global pause control, poster fallbacks and visibility-based playback are required. No background audio.

## Sources and interpretation

- Source draft: 14 sections in the original repository. Medical wording is condensed, not converted into individual prescriptions.
- AHA, dietary guidance, 31 March 2026: https://professional.heart.org/en/science-news/2026-dietary-guidance-to-improve-cardiovascular-health/top-things-to-know
- AHA, patient guidance, reviewed 31 March 2026: https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/aha-diet-and-lifestyle-recommendations
- ESC/EAS, 2025 focused update: https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/dyslipidaemias/
- NHLBI, causes: https://www.nhlbi.nih.gov/health/blood-cholesterol/causes
- NHLBI, symptoms: https://www.nhlbi.nih.gov/health/blood-cholesterol/symptoms

No numerical outcomes, LDL targets, food quantities or clinical risk scores are invented. Character appearance is not used to infer risk. Two weeks means a practice interval, not a promised interval for changing blood tests.

## Media register

- Food, people and fat comparison: original AI educational illustrations supplied in the draft. Source hashes preserved in the repository; optimized derivatives are used on the page.
- Human loop: existing MILLER `healthcare-forest-music.mp4`, 0.4 to 6.0 seconds, cropped to the human image to exclude titles and programme statistics; audio removed.
- Heart loop: existing MILLER `healthcare-heart-music.mp4`, 12.0 to 17.6 seconds, cropped to exclude old captions; audio removed. A conceptual illustration, not diagnostic imaging.
- Logo: original supplied wordmark, unchanged.
- Manrope / Playfair Display: existing self-hosted studio fonts; OFL texts included.

## Economics and limitations

Internal test, no commercial revenue or margin assertion. New paid generation jobs: 0. New paid assets: 0. Existing films are reused as silent fragments. Human labor hours cannot be inferred from agent execution time and are not fabricated. The branch is for design and medical review; final medical sign-off remains pending.

## QA and release

Verification results and preview details are recorded in `QA.md` after implementation. Main is not merged by this task. Rollback: discard this comparison branch or revert its commit.
