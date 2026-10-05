# Original lecture typography evidence

Fetched 2026-10-05 UTC from https://verba-heart.website.yandexcloud.net/
Stylesheet linked directly by original HTML: https://verba-heart.website.yandexcloud.net/_next/static/chunks/15fz2t~bmzjbw.css

`original-lecture.css` is unmodified downloaded CSS. `original-lecture-readable.css` only adds a newline after each closing brace. Line references below refer to the readable copy. These are source-level rules, not browser-computed style measurements. No DevTools used.

## Exact applicable base and desktop rules

Line 20: `:root{color:#1d2220;font-synthesis:none;text-rendering:optimizelegibility;-webkit-font-smoothing:antialiased;background:#f3f1eb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}`

Line 48: `.eyebrow{color:#6f7d62;letter-spacing:.18em;text-transform:uppercase;align-items:center;gap:12px;margin-bottom:clamp(16px,2.2vh,26px);font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}`

Line 50: `h1{color:#202421;letter-spacing:-.047em;max-width:12.8ch;margin:0;font-family:Iowan Old Style,Baskerville,URW Bookman,Georgia,serif;font-size:clamp(3.05rem,5vw,5.2rem);font-weight:400;line-height:.94}`

Line 51: `.lead{color:#555b56;max-width:49ch;margin:clamp(20px,2.6vh,30px) 0 0;font-size:clamp(14px,1.02vw,17px);font-weight:400;line-height:1.62}`

Line 100: `.scene-caption{z-index:3;color:#6c6f69;letter-spacing:.1em;text-transform:uppercase;grid-template-columns:auto auto;align-items:center;gap:4px 9px;max-width:255px;font:500 9px/1.25 ui-monospace,SFMono-Regular,Menlo,monospace;display:grid;position:absolute;bottom:clamp(68px,9.5vh,104px);right:clamp(28px,4.4vw,70px)}`

Line 101: `.scene-caption b{color:#8c8e87;letter-spacing:.04em;text-transform:none;grid-column:2;font-weight:500}`

Line 106: `.footline{z-index:3;color:#92938d;letter-spacing:.07em;text-transform:uppercase;justify-content:space-between;align-items:flex-end;gap:30px;font:500 8.5px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;position:absolute;bottom:clamp(22px,3.5vh,38px);left:clamp(28px,4.6vw,78px);right:clamp(28px,4.4vw,70px)}`

Line 847: `@media (min-width:641px){.desktop-deck .eyebrow{letter-spacing:.15em;font-size:clamp(13px,.82vw,15px)}`

Line 848: `.desktop-deck h1{font-size:clamp(3.45rem,5.35vw,5.8rem)}`

Line 849: `.desktop-deck .heart-rebuilt-copy h1,.desktop-deck .stroke-rebuilt-copy h1,.desktop-deck .lipids-copy h1,.desktop-deck .vascular-copy h1,.desktop-deck .diagnostics-copy h1,.desktop-deck .case-copy h1{font-size:clamp(3.2rem,4.9vw,5.2rem)}`

Line 850: `.desktop-deck .lead,.desktop-deck .heart-rebuilt-lead,.desktop-deck .stroke-rebuilt-lead{font-size:clamp(19px,1.32vw,23px);line-height:1.48}`

Line 851: `.desktop-deck .hero-subtitle{font-size:clamp(19px,1.3vw,23px);line-height:1.42}`

Line 852: `.desktop-deck .hero-speaker strong{font-size:clamp(1.2rem,1.45vw,1.55rem)}`

Line 853: `.desktop-deck .hero-speaker span{font-size:15px}`

Line 854: `.desktop-deck .hero-speaker b{font-size:12px;line-height:1.4}`

Line 887: `.desktop-deck .scene-caption{font-size:11px;line-height:1.45}`

Line 888: `.desktop-deck .footline{letter-spacing:.045em;font-size:10px}`

## Interpretation and cautions

- The HTML preloads Geist and Geist Mono and applies their variable-definition classes, but the explicit root and heading declarations select the system sans/serif stacks instead. Do not infer Geist is the rendered body or heading font.
- Headings use normal 400 weight and a compact serif stack: Iowan Old Style, Baskerville, URW Bookman, Georgia, serif. Exact rendered font depends on the machine. Heading tracking is -0.047em and base line-height 0.94.
- Desktop eyebrow, lead, caption and footer overrides above supersede earlier smaller declarations. The desktop breakpoint is 641px.
- Caption title is uppercase mono with 0.1em tracking; the second line `<b>` explicitly changes to sentence case, 500 weight, 0.04em tracking, and grid column 2.
- CSS hides scene captions at narrower mobile breakpoints. Do not copy their desktop absolute placement into mobile without preserving the existing responsive intent.
- The final desktop h1 size rule has equal specificity to some per-scene h1 rules and appears later; its inherited family/weight/spacing remain unchanged. A separate higher-specificity desktop group sets heart/stroke/lipids/vascular/diagnostics/case headings to clamp(3.2rem,4.9vw,5.2rem).
