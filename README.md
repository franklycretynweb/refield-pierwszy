# Nektarowa — Refield Homes

Pierwotna strona Nektarowej przeniesiona z Vite na Next.js 16 App Router.
Zachowuje układ galerii, standardu, domów, cennika, przebiegu budowy,
dziennika, zespołu i stopki. Typografia, motywy, header, monogram w hero
oraz styl interakcji pochodzą z
[refield-nowszy](https://github.com/franklycretynweb/refield-nowszy)
(commit `5968b31ea8742990a21dcd17c17fbe19eb982ccd`).

## Uruchomienie

Wymagany Node.js 20.9 lub nowszy.

```sh
npm install
npm run dev
```

Podgląd: http://localhost:5182.

```sh
npm run build
npm start
```

## Zachowanie strony

Light/dark obejmują całą stronę, header, stopkę i modale. Motyw jest
zapamiętywany, a jego inicjalizacja odbywa się przed pierwszym renderem.
Hero zawiera monogram Refield zamiast dawnej linii i napisu.

Przyciski, linki, zdjęcia, karty, filtry i zakładki korzystają ze wspólnego
stylu interakcji. Karty standardu mają niezależne wysokości i płynne
otwieranie/zamykanie, także po szybkim ponownym kliknięciu.
Lenis obsługuje przewijanie i kotwice; dialogi oraz menu przewijają się
natywnie. Animacje respektują ograniczenie ruchu, a modale oddają fokus.

Dane dostępności, ceny i formularz powiadomień pozostają demonstracyjne.
Sekcji lokalizacji nie ma w tej wersji.

## Weryfikacja

Przy uruchomionym serwerze:

```sh
npx playwright install chromium
npm run test:smoke
npm run test:styles
npm run test:contrast
npm run test:accordions
```

Można wskazać zainstalowany Chromium zmienną `BROWSER_EXECUTABLE`.
Kontrole obejmują funkcje, dwa motywy, szerokości 320–1716 px, kontrast,
brak przepełnień, kotwice i animacje niezależnych kart standardu.

## Struktura

- `src/app`: App Router i adaptacja stylów.
- `src/components`: header, efekty przewijania i inicjalizacja interakcji.
- `src/legacy`: zachowane style i interakcje pierwotnej strony.
- `src/data`: prerenderowany markup, znak w hero i nawigacja.
- `scripts/migrate-vite.mjs`: odtwarzanie migracji z zachowanego źródła.
- `work/vite-matching`: niezmienny snapshot źródłowego HTML/JS/CSS Vite.

`npm run migrate:snapshot` odtwarza pliki wygenerowane. Nowsze repozytorium
pozostaje odrębnym projektem; ta strona nie zapisuje do niego zmian.
