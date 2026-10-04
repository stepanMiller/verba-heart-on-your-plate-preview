# V4 · Asset register

Новая версия находится в `versions/v4/`; старые материалы остаются в своих ветках / папках, но не загружаются в V4. Никаких новых AI-генераций, платных генераций или Runway credits. Runway не требуется.

| V4 path | Provenance / use |
|---|---|
| `assets/food.webp` | Исходная AI food-иллюстрация, сжатая версия из V3 `f1293eb8a9576bda090ec4be6405358719b2ed85`; s01 / s07 / s14. Не меню курорта |
| `assets/verba-wordmark.png` | Существующий wordmark пользователя из репозитория / утверждённой VERBA Heart |
| `assets/olive-motion.mp4` | Побайтовое переиспользование Hero Lecture / consolidated, commit `09a23b24329b9575b0cb2189f5f6db51aea84fc6`; 1280×720, 1.5s, H.264, без звука. Унаследованный иллюстративный food motion, не новая генерация и не документальная съёмка VERBA. Не делаем неподтверждённых заявлений о модели / стоимости старого ассета |
| `assets/olive-poster.webp` | Новый локальный WebP кадр унаследованного olive-motion.mp4; FFmpeg, без генерации |
| `assets/food-montage.mp4` | Побайтовое переиспользование Scroll Film `codex/verba-scroll-film-20261002`; 960×720, 11.625s, H.264, без звука. Просмотрен contact sheet всех секунд; только еда и функциональные руки |
| `assets/food-montage-poster.webp` | Существующий poster того же Scroll Film |
| `assets/heart-loop.mp4` / `heart-poster.webp` | V3; собственный VERBA Heart CGI пользователя. 6s, 1000×440, 24fps. Условный сосудистый поток, не измеренный эффект лечения |
| `assets/showreel-v4.mp4` | **Новый** локальный 24s монтаж реально работающих V4 DOM / Canvas / SVG / CSS сцен, olive motion, реального macro food и собственного CGI. H.264, 1280×720, 24fps, yuv420p, faststart, без звука. Сборка: `tools/render-film.cjs` + FFmpeg |
| `assets/showreel-poster.webp` | **Новый** локальный кадр showreel, WebP |
| Inline SVG / Canvas / CSS | **Новые процедурные композиции**: контекст ЛПНП, орбитальный переносчик, растворимая клетчатка / всасывание, сахара / ТГ, упаковка, клинические досье, календарь. Нет клинических измерений, реальных молекул или реалистичной биохимии |

## Clean food footage

Media register Scroll Film (`PROJECT_RECORD.md` на донорской ветке) указывает:

- [Mixkit 10420 · Fresh vegetables on a wooden board close-up](https://mixkit.co/free-stock-video/fresh-vegetables-on-a-wooden-board-close-up-view-10420/)
- [Mixkit 40524 · Top view of a woman slicing vegetables](https://mixkit.co/free-stock-video/top-view-of-a-woman-slicing-vegetables-40524/)
- [Mixkit 52473 · A stream of olive oil falling in slow motion](https://mixkit.co/free-stock-video/a-stream-of-olive-oil-falling-in-slow-motion-over-52473/)

Донор сообщает Mixkit Stock Video Free License и получение 02.10.2026: https://mixkit.co/license/ . В V4 файлы уже существующей ветки переиспользованы без загрузки новых стоков; исходный provenance сохранён. Лицензия не переоформлялась, отдельная юридическая экспертиза не проводилась.

## Explicit exclusions

Mixkit **40519** / **40530**, V3 `food-live.mp4`, `food-live-mobile.mp4`, `hero-live*`, `showreel-v2.mp4`, `people.webp`, `life-kitchen.webp` и любые случайные stock portraits **не входят в V4 и её новый showreel**. Текущие документы V3 неверно описывают food-live как масло: непосредственный просмотр показал кадр людей у салата. Исключение основано на просмотре самого файла.

Старые файлы предыдущих версий не удалены из репозитория: это отдельные сохранённые материалы, не часть загрузки V4.
