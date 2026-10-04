# VERBA V5 — Внутри обычного дня

04.10.2026 · Visual DNA v1.0 · high-fidelity creative prototype, не production-final.

## Creative sentence

Человек пытается понять своё здоровье. Мы начинаем с паузы за завтраком, входим внутрь липидного транспорта и возвращаемся к разговору с врачом и обычной жизни. Тарелка участвует в истории, но не заменяет человека.

## Статус и порядок решений

- Brief `ASTRA_V5_ART_DIRECTION_BRIEF.md` прочитан первым в ветке `astra/v5-human-cinematic-reboot-2026-10-04`.
- V4, `V4_MASTER_DIRECTION.md`, `V4_SCIENCE_AUDIT.md` изучены как technical/science donor. Их светлая сетка и showreel не считаются утверждённой арт-дирекцией.
- Созданы три контрольных кадра: S01 casting/hero, S03 LDL cutaway, S12 консультация. После внутренней проверки S03 переведён из тёмного металлического образа в светлый условный разрез; S12 из домашней среды в светлый кабинет.
- Пользователь принял направление трёх контрольных кадров 04.10.2026: «Да, это уже похоже на правду». Следующий приоритет — оживление S03. Это одобрение направления, не медицинский sign-off и не разрешение на платную генерацию.

## Visual research / evidence map

| Материал | Статус | Наблюдение и решение |
|---|---|---|
| https://verba-heart.website.yandexcloud.net/ · просмотр в облачном браузере 04.10.2026 | Strong reference / Observed | Светлая минеральная основа, большая редакционная антиква, достоинство взрослого человека, тихое пространство. Сохраняем тон и тактильность, не копируем композиции |
| V4 HTML/CSS/JS и научные документы | Functional only / Confirmed | Хорошая структура 14тем, источники, native scroll и lifecycle motion; визуальная драматургия недостаточна |
| V4 olive-motion / heart-loop | Useful fragment / Observed | Настоящее предметное движение и узнаваемый сосудистый CGI; пригодны как короткие film shots |
| Три V5 anchors и ответ пользователя | Project approval / Confirmed | Узнаваемая героиня, светлый научный macro, настоящая сцена слушания задают направление |
| Новая палитра, монтажный ритм, casting bible | Proposed implementation | Проектная система V5, не официальный брендбук VERBA |

Внешние stock-изображения не использованы. Лицензии на реальную съёмку бренда не предполагаются. Сгенерированные лица — художественные персонажи, не реальные сотрудники, пациенты или портрет лектора.

## Narrative Blueprint

Аудитория: взрослые 45–55, preventive-health, без специальной биохимической подготовки. Желаемое действие: понять, почему питание важно, но не заменяет индивидуальную оценку общего риска, выбрать одну устойчивую привычку и задать врачу три вопроса.

1. **Вопрос человека, S01–S02.** Узнавание себя и снятие моральной оценки анализа.
2. **Увидеть механизм, S03–S07.** Переносчик/груз; замены; вязкая клетчатка; печёночная обработка энергии; разнообразие белка.
3. **Вернуться в быт, S08–S09.** Повторяемая практика и осмысленное чтение упаковки.
4. **Вернуть контекст, S10–S12.** Один ЛПНП не равен общему риску; питание и показанная терапия; разговор с врачом.
5. **Малое действие, S13–S14.** Привычка в течение двух недель как редакционный период практики, затем жизнь продолжается.

Critical: переносчики/липиды, замена вместо добавления, общий риск, врач. Important: клетчатка, ТГ, этикетка, привычка. Supporting: условные механистические детали. Appendix: источники и ограничения. Remove: проценты без данных, гарантии лабораторного эффекта, «хороший человек = хороший анализ», экранные dashboard-панели.

## Master casting / continuity bible

Primary protagonist: художественная женщина около51года, короткий волнистый каштановый bob, заметная седина у висков, ореховые глаза, естественные линии кожи, мягко угловатое лицо. Ivory linen shirt связывает S01/S02/S08/S10/S12; светлый olive cardigan остаётся в историческом courtyard-кадре S14. Текущий S14 использует ту же героиню в ivory-рубашке за столом с салатом. S01 — master casting, все последующие human assets созданы с ним как reference.

Secondary: художественный врач в S12, тёмные убранные волосы, cream jacket/sage blouse, внимательный взгляд. Не выдаётся за Юлию Кондальскую. Никаких случайных пар, новых персонажей и улыбок в камеру. В клинических сценариях S10 фото никогда не меняется при переключении факторов.

## Visual DNA / operational rules

- **Цвет:** cream / oat / ivory — основной редакционный воздух; olive/graphite — текст и глубина; honey — условный lipid cargo. Точные CSS tokens проектные, не заявлены как официальный брендбук.
- **Тональный ритм:** плотный human S01, затем светлые S02–S07; бытовая фактура S08; светлые controlled objects S09–S10; глубокий vessel S11; светлая консультация и финал. Не тотальная тёмная галерея.
- **Типографика:** крупная выразительная антиква для одного тезиса, системный sans для причинности и управления. Сильное левое поле, короткие строки, свободное место вокруг лица/жеста. В anchors использован локальный Noto Serif Display fallback; runtime — системная Georgia/Times. В production требуется фиксировать доступный лицензированный webfont для полного совпадения.
- **Фотография:** natural side light, 40–50mm editorial perspective, реальные текстуры кожи/льна/дерева, действие или пауза; без generic wellness stock.
- **Science:** физическая тактильность, оптическая глубина, ясный объект; без неонового sci-fi. Каждая условная модель видимо названа условной. Изображение не выдаётся за молекулярную реконструкцию.
- **Композиция:** один герой кадра; разная крупность и распределение масс; 3–5секунд для первого смысла. Фото и типографика живут в одном поле; отдельные «карточки» только когда функционально нужны.
- **Motion:** не единый parallax. Human — approved generated motion в S01/S14, still-based optical intention в S08/S12; science — последовательное причинное чтение; object — управляемый поворот/замена/выбор.

## Component contracts / anti-patterns

Human hero: full bleed + короткий тезис в безопасном поле; не помещать текст на глаза/руки. Science macro: один условный объект + 1–2 точных подписи + отдельный detail; не превращать в dashboard. Context portrait: неизменное лицо + изменяемая клиническая рамка; не «здоровый/больной» по внешности. Consultation: общий взгляд и жест + один главный вопрос; не doctor-and-happy-patient. Controlled package: текст HTML/SVG, fixed geometry; не AI-этикетка. Native detail: сначала ограничение, затем источник; клавиатура и возврат фокуса.

Запрещены: одна тарелка на все пищевые темы; оболочка LDL как клеточная двойная мембрана; выход свободного «холестерина» из картинки; HDL как щит; сахар, неизбежно превращающийся в ТГ; растворение бляшек; мультяшное улучшение здоровья; slideshow под видом фильма.

## Format profiles

HTML: native scroll, responsive text/image layout, accessible details, reduced motion/Save-Data, no analytics. Large renders: fixed1920×1080 for art direction. Mobile: image retains face and meaningful action; content may stack rather than shrink. Film: independent cropped source shots, no UI, slide numbers or complete slide states. PDF/PPT not part of this prototype scope.

## Asset register

New built-in imagegen assets: s01-master-casting, s02-context, s03-lipoprotein-cutaway, s05-fibre, s06-hepatic, s07-protein, s08-everyday, s10-portrait, s12-consultation, s14-closing. Controlled S09 package is code-native. New runtime/composition, separate 26 s foyer film, preserved 26 s animatic, S03 optical motion study and render/QA tooling.

Reused V4 assets: olive-motion.mp4, olive-poster.webp, heart-loop.mp4, heart-poster.webp, verba-wordmark.png. Reused facts/source layer from V4 audit with V5 addendum. V4food.webp, stock couple, old showreel and old sphere not reused.

## Review limits / next gates

Creative prototype only. Scientific editorial review is documented; final clinical sign-off remains open. Four approved generated clips add actual video movement to S01, S03, S06 and S14, using the accepted ranges described below. S08 and S12 still-based optical movement is not claimed as natural video. The approved 240-credit package is fully used; no further generation is authorized. No main merge and no Yandex publication. Recorded final integrated cloud-browser checks are in `ASTRA_V5_QA.md`; remaining gates include untested lifecycle/accessibility cases, physical-device/cross-browser checks and clinical approval.

## Review changes after the anchor gate

04.10.2026: the user accepted the rest of the visual direction but rejected the first mobile implementation. Mobile was rebuilt as a separate reading-and-interaction layout and checked in cloud Chromium at the recorded review commit; see `ASTRA_V5_QA.md`. All interactive arrows/play/rotate/close controls use inline SVG; touch targets are at least 44px, preferably 48px. That earlier mobile QA is distinct from the later four-clip integration. The exact-SHA final integration measurements and the remaining unrun cases are recorded separately in `ASTRA_V5_QA.md`.

The user also requested meaningful film titles and recognizable creator attribution. Ending hierarchy: authentic VERBA mark with «Медицинский курорт», then the authentic MILLER wordmark with smaller «Visual Production». MILLER's site uses HTML/CSS typography; the supplied SVG is an exact outline export of the official bundled Manrope 600 and tracking, not a generated or invented logo. Source commit and verification are in `assets/miller-logo-provenance.json`.

A clear motion-readiness matrix is maintained in `ASTRA_V5_MOTION_READINESS.md`. Approval of visual direction or of attribution is not approval to spend Runway credits. The earlier single 60-credit S03 proposal was superseded by the four-clip 240-credit package, not added to it. The exact final accounting follows.

## Approved motion production — final accounting

The initial no-spend phase is superseded by the user's explicit four-clip approval: Gen-4.5, four 5-second outputs, one successful generation each, total 240 credits. Three initial source-host failures showed no net decrease; their recovery was separately approved. The verified net cost of the four successful outputs is 240 credits; account-wide balances are retained only in the private reconciliation. No automatic retry, upscale, audio or further generation was used.

Real video now exists for the heroine, salad serving, lipoprotein and liver. Editorial acceptance uses the stable parts: S03 retains its visible cutaway only in the opening approximately 2 seconds; S06 uses its uncropped early approximately 3 seconds. These limits are reflected in web/film derivatives. Other scenes retain the documented explanatory/object motion or still imagery; natural human motion in S08/S12 is not claimed. The independent foyer film and original ten-shot animatic are separate deliverables.
