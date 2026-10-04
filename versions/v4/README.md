# VERBA V4 · Сердце на вашей тарелке

14-сценная интерактивная лекция Юлии Кондальской: продукт → механизм → показатель. Vanilla HTML / CSS / JS, без внешних runtime-зависимостей, шрифтов, аналитики и отправки выбора привычки. Новая версия изолирована от старых страниц.

Из корня репозитория: `python3 -m http.server 4173`, затем `http://localhost:4173/versions/v4/`.

На первом слое — одна мысль, на втором — объяснение, ограничения и источники. Без JS доступны все сцены и нижние `<details>`. Reduced motion и Save-Data отключают ambient motion и загрузку видео; showreel играет только по явному запросу. Вне экрана, в скрытой вкладке и в диалогах ambient video / Canvas остановлены. Скролл нативный.

## Production and checks

`npm install` в этой папке устанавливает только dev-tool Playwright. `npm run check`, `npm run qa`, `npm run render:film`. Для рендера нужен FFmpeg и Chromium (`VERBA_CHROMIUM` может задавать путь; по умолчанию `/usr/bin/chromium`). Сервер должен быть запущен отдельно. `VERBA_URL` меняет URL; `VERBA_WEBKIT=1` включает WebKit, установленный через `npx playwright install webkit`.

- [Creative direction](../../docs/V4_MASTER_DIRECTION.md)
- [Scientific audit](../../docs/V4_SCIENCE_AUDIT.md)
- [Assets and exclusions](../../docs/V4_ASSET_REGISTER.md)
- [QA report](../../docs/V4_QA_REPORT.md)

Медицинское согласование не завершено. Это просветительское review preview; индивидуальные решения принимают с врачом. Платных генераций и Runway credits: **0**. Merge в main не выполняется.
