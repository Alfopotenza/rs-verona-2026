# RS Verona 2026 — post-event recap

Bilingual static archive of the European Youth Parliament Regional Session held in Verona on 22–25 October 2026. Plain HTML, CSS and JavaScript; no build step.

## Pages

- `index.html`: recap, featured press coverage and Resolution Booklet.
- `press.html`: the four published press articles.
- `booklet.html`: Resolution Booklet, download and links to the eight committees.
- `me-in-eyp.html`: how to continue in EYP, roles, quiz and applications.
- `rsverona.html`: session vision, officials, partners and figures.
- `contacts.html`: session mailbox, EYP Italy HR, website and Instagram.
- `it/`: matching Italian pages with the same filenames.

The operational Hub, topic page and travel/preparation information have been retired. `hub.html`, `topics.html` and `it/topics.html` contain only redirects, preserving existing bookmarks and printed QR codes. Welcome booklets, preparatory documents and calendar downloads have been removed; prior versions remain in Git history.

## Editing

Edit both languages together. The navigation and footer are repeated in each HTML file. Keep relative links (`./` at the root, `../` for shared assets from `it/`) so GitHub Pages project paths work correctly.

- Styles: `assets/styles.css`.
- Menus, dialogs, team tabs and quiz: `assets/script.js`.
- Booklet: `documents/resolution-booklet-verona-2026.pdf` (30 pages, English).
- Booklet cover: `assets/images/resolution-booklet-cover.jpg`, rendered from the PDF.
- The booklet index uses physical PDF page numbers, including the cover and contents: REGI 7, CRIM 10, AGRI 14, ITRE 17, LIBE 20, JURI 23, SEDE 25, CULT 28. Update links and metadata if the PDF changes.
- Press: preserve source titles and URLs in `press.html` and `it/press.html`; update the home page excerpts together.
- Partners: keep names, logos, dialog IDs and groups aligned between languages. Source notes live in `PARTNERS_REPORT.md`; do not add unverified supporters as confirmed partners.

The installed web app now opens on the recap. `sw.js` precaches the twelve main pages and essential assets. The booklet is fetched on demand and a full successful PDF response can be cached for later offline use; it is not downloaded automatically. Bump `CACHE_VERSION` when changing the precache list. Old caches are removed on activation.

## Preview and publication

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` (English) or `http://localhost:8000/it/` (Italian).

The existing GitHub Actions workflow publishes the repository to GitHub Pages on pushes to `main`. Preview metadata uses `https://alfopotenza.github.io/rs-verona-2026/`; update `og:url` and `og:image` if the hosting address changes.
