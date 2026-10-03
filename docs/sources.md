# Источники и происхождение

Проверено 02.10.2026:

1. AHA, Dietary and Lifestyle Recommendations, last reviewed March 31, 2026: https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/aha-diet-and-lifestyle-recommendations
2. WHO, July 17, 2023, fats and carbohydrates: https://www.who.int/news/item/17-07-2023-who-updates-guidelines-on-fats-and-carbohydrates
3. ESC/EAS, 2025 Focused Update: https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/All-ESC-Practice-Guidelines/Dyslipidaemias
4. NHLBI, Blood Cholesterol Causes and Risk Factors, April 19, 2024: https://www.nhlbi.nih.gov/health/blood-cholesterol/causes

Прямые ссылки находятся в конце истории. Самостоятельные назначения, целевые числа и прогнозы не добавлялись. Материал остаётся дизайн-версией, медицинское согласование не завершено.

## Ассеты

- `verba-wordmark.png`, `hero-clean.png`, `swap-clean.png`, `people-clean.png`: предоставлены в исходном репозитории. Согласно исходному README, фотографии созданы ИИ, персонажи вымышлены; wordmark взят из ранее утверждённой презентации пользователя.
- `assets/life-kitchen.webp`: новая иллюстрация, созданная встроенным imagegen 02.10.2026. Вымышленная пара 45–55 лет готовит салат в домашней кухне; это не люди или интерьер VERBA.
- `assets/food.webp`, `assets/swap.webp`, `assets/people.webp`: сжатые WebP-копии исходных иллюстраций.
- `assets/hero-motion.mp4`: плавное приближение/отдаление новой фотографии, 8 секунд, без звука, зациклено.
- `assets/intro-film.mp4`: 18-секундный монтаж трёх фотографий с приближением и растворением, без звука.
- Canvas и SVG написаны для проекта. Сфера частиц концептуальная, не анатомическая модель и не измерение.
- Новых внешних фотографий, платного видео и внешних JS/CSS-библиотек нет.

## Prompt новой фотографии

Use case: photorealistic-natural. Asset type: full-bleed desktop and mobile hero photograph for an editorial medical web story about food and heart health. A fictional couple aged about 45–55 quietly prepares a fresh vegetable and chickpea salad in a lived-in home kitchen, ivory linen and olive cotton clothing, relaxed connection, not looking at camera. Warm evening window light, dark muted forest-green cabinetry, cream stone worktop. Wide 16:9, subjects and food on right two thirds, darker defocused negative space on far left. Realistic natural faces and hands, magazine editorial photography, gentle grain, shallow depth of field. No medical uniform, logo, text or watermark. Avoid advertising smiles, oversaturation and plastic skin.

## Видео Codex V2

Скачано 02.10.2026. При подготовке проверены страницы конкретных клипов: они помечены Mixkit Stock Video Free License, с разрешением коммерческого и личного использования. Это иллюстрация повседневного питания, не съёмка гостей или кухни курорта. Не заявляется участие людей в рекламе VERBA.

| Исходник | Использование | Лицензия / происхождение |
|---|---|---|
| [Couple preparing salad at home, 40519](https://mixkit.co/free-stock-video/couple-preparing-salad-at-home-40519/) | Главный экран, вертикальный mobile crop, глава s08 и шоурил | Mixkit Stock Video Free License |
| [Woman pouring olive oil over salad, 40528](https://mixkit.co/free-stock-video/woman-pouring-olive-oil-over-salad-40528/) | Крупная видеокарточка, шоурил | Mixkit Stock Video Free License |
| [Couple preparing salad in kitchen, 40530](https://mixkit.co/free-stock-video/couple-preparing-salad-in-kitchen-40530/) | Шоурил, крупные планы подготовки еды | Mixkit Stock Video Free License |
| [VERBA Heart, v05](https://verba-heart.website.yandexcloud.net/media/VERBA-Heart-Review-v05.mp4?v=20260913-2) | Фрагмент 8,5–16,5 секунды, crop для удаления исходных субтитров, шоурил | Собственный проект пользователя, указанный им как референс |

[Лицензии Mixkit](https://mixkit.co/license/). Исходники стоковой съёмки получены в Full HD. Для web изготовлены локальные MP4 H.264: desktop 1280 × 720, mobile hero 540 × 960, mobile карточка 854 × 480. Цвет, тайминг, склейки и титры собраны отдельно. Звука в шоуриле нет. Платные генерации и кредиты Runway не использовались.

## Codex V3, 03.10.2026

Повторно открыты официальные страницы WHO, NHLBI, AHA и ESC/EAS; тезисы сокращены из V2, новых клинических чисел и назначений нет. В основном просмотре детали перенесены в модальные пояснения; без JS они доступны в нижнем приложении.

Hero первого экрана — исходный assets/food.webp, а не новая случайная стоковая пара. В s14 сохранена созданная ранее вымышленная домашняя пара assets/life-kitchen.webp. Для s08 используется существующий крупный план 40528, уже кадрированный в V2 без лиц. В шоуриле сохранены оригинальные иллюстративные стоковые персонажи; они не пациенты и не сотрудники VERBA.

assets/heart-loop.mp4: фрагмент 8,8–14,8 секунды собственного VERBA Heart v05, кадр 910 × 400 из верхней области, масштаб 1000 × 440, H.264, 24 fps, без звука. assets/heart-poster.webp — кадр этого видео. Сосудистый поток концептуальный и не показывает количественный эффект питания или лечения. Исходное видео пользователя уже было частью V2; ссылка на происхождение сохранена выше.

Новая сфера и схемы написаны для V3. Они художественно-учебные, не измерения. Два портрета не связаны с оценкой риска по внешности. Стоковые исходники, чужой код и скриншоты референса не добавляются в публичный пакет. Платные генерации и кредиты не использовались.
