# VERBA targeted finishing review

Separate review version based on `31526bd24277c0913dd7d21315c5779296883132`.
Previous version: `../v6-final/`. This new directory does not replace it.

- Presentation: `index.html`
- Film: `assets/foyer-film.mp4` (26 seconds, native 1280×720, silent)
- Evidence and limitations: `review/FINISHING-REPORT.md`

No paid generation, new clinical claims, production deployment, or main merge.
S01 deliberately uses the calm still fallback, avoiding artificial mouth motion.

`npm run check` checks JavaScript syntax. `python3 tools/check-finishing.py`
checks inherited clinical copy, source details, asset references and media decode.
`npm run qa` is the repository browser suite; it was not run successfully here:
local Chromium startup failed with socket() Operation not permitted. No security
or sandbox restrictions were changed. Mobile/device QA is outstanding.

The offline render scripts document exactly which approved media is used.
For film rebuilding supply the original salad raw and the original approved
film as the two command-line arguments. Both inputs remain unchanged.
