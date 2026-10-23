# RS Verona 2026 — static website

Website for RS Verona 2026, a Regional Session of the European Youth Parliament.

The site uses only HTML, CSS and JavaScript. It has no build step and is ready for GitHub Pages.

## Site structure

The site is split into a **showcase** part (English + Italian) and an **Event's Hub** (English only, for delegates and staff during the session).

```
index.html                 Home — hero, press announcement, event opening and session essentials
rsverona.html              About RS Verona — vision, team and partners
press.html                 Press coverage — articles about the session
topics.html                Committee topics
me-in-eyp.html             How to stay involved after the session
contacts.html              Contacts, preparation, safeguarding and FAQ
hub.html                   Event's Hub — schedule, venues, materials and contacts
it/                        Italian versions of the six showcase pages (same filenames)
```


`hub.html` has no Italian version by design — it's the operational page used during the
session and is kept English-only.

### Adding/editing content

- Showcase pages (EN): edit the file directly in the repository root.
- Showcase pages (IT): edit the matching file in `it/` — same filename, same section IDs.
- Event's Hub: edit `hub.html` only.
- Colours and layout: `assets/styles.css`. The photo backgrounds (parallax on desktop, static on phones) are declared once as `--photo-*` variables at the top of the "Visual upgrade" block.
- Interactive schedule, tabs and menus: `assets/script.js`
- Logo and images: `assets/images/`
- Future PDF booklets: `documents/`

Every page in `it/` links back to its English counterpart (and vice versa) through the
`EN`/`IT` switch in the header — keep that link updated if you rename a file.

When a booklet is ready, add the PDF to `documents/` and replace the corresponding material row in `hub.html` with a link. Always use relative links, for example:

```html
<a class="material-row" href="./documents/welcome-booklet.pdf">
  <!-- row content -->
</a>
```

Relative paths beginning with `./` (or `../` inside `it/`) are intentional: they allow the
site to work both at `username.github.io` and at `username.github.io/repository-name/`.

### Partners

The Partners section in `rsverona.html` and `it/rsverona.html` separates main sponsors, technical/food/material sponsors, cultural/social partners, institutional patronages and other existing supporters. Update both languages together and preserve each partner's dialog ID. `#partners` is linked from the About page navigation and from the home page.

Logos live in `assets/images/partners/`; official download sources and the current verification status are recorded in `PARTNERS_REPORT.md`. Logos retain their aspect ratio with `object-fit: contain`. If an official logo is unavailable, show the organisation's name without a placeholder. Do not add unverified organisations to the confirmed groups. The European Parliament's previously published name is retained in a separate pending-verification note until event-specific official confirmation is available.

### Event's Hub details

- **Schedule**: each day is a `.schedule-panel` in `hub.html`, with its timeline and a "host school / hotels" block underneath. Only the selected day is shown; the page opens on today's date during the session.
- **Menu**: the Lunch & dinner card opens the `#modal-menu` dialog (menu provided by Arya SRL).
- **Venues**: addresses are listed in the "Addresses & transfers" and "Stay information" cards.
- **Members' Platform**: the "Apply to another session" card in `me-in-eyp.html` opens a dialog (`#modal-apply`) that sends people to the sign-in or sign-up page.

### "Which team are you?" quiz

The quiz in `me-in-eyp.html` and `it/me-in-eyp.html` (section `#quiz`) is driven by
`assets/script.js`, but all its text lives in the HTML:

- each statement is an `<li>` in `.quiz-items`, with `data-w` saying which team it
  points to and how strongly (`a` Academic, `m` Media, `o` Organising; negative
  values point away), e.g. `data-w="m:1,a:-0.5"`;
- each result is a `.quiz-profile` block (`academic`, `media`, `organising`,
  `balanced` when no team reaches 40%).

Edit both languages together and keep the statements in the same order.

### Sharing, home-screen icon and QR codes

- The site address is written in the `og:*` tags of every page (link previews on
  WhatsApp, Instagram, Telegram…) and in the QR codes. It is currently
  `https://alfopotenza.github.io/rs-verona-2026/`: if it changes, update the
  `og:url` / `og:image` tags and regenerate the QR codes.
- The site is a web app: `manifest.webmanifest` + `assets/images/icons/` let people
  install it on their phone (it opens on the Event's Hub), and `sw.js` keeps it
  working offline. Pages, CSS, JS and PDFs are always taken from the network when
  there is a connection, so updates show up immediately; the saved copy is used
  offline. The Hub shows an "Install" bar (instructions on iPhone). If you add a
  page or an asset that must work offline from the first visit, add it to
  `PRECACHE` in `sw.js` and bump `CACHE_VERSION`. The service worker only runs over
  https or on `localhost` (see "Local preview"), not when opening files directly.
- `assets/qr/qr-hub.*` (Event's Hub) and `assets/qr/qr-home.*` (home page) are
  ready to print: use the SVG for print, the PNG for slides and social media.

### Images and PDFs on phones

- Photo backgrounds have lighter copies in `assets/images/m/` used up to 980px
  wide. If you replace a background photo, replace its mobile copy too.
- The PDFs in `documents/` were compressed for phones (text, links and bookmarks
  unchanged). Compress new booklets before uploading when they are above ~8 MB.

## Local preview

From this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

Create an empty GitHub repository, then run:

```bash
git init
git add .
git commit -m "Initial RS Verona 2026 website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/rs-verona-2026.git
git push -u origin main
```

On GitHub open **Settings → Pages** and choose **GitHub Actions** under “Build and deployment”. The included workflow publishes the site after every push to `main`.

If you prefer not to use the included workflow, choose **Deploy from a branch**, select `main` and the `/ (root)` folder.

## Team photos

Official profiles with available photos use images in `assets/images/officials/`. Profiles without photos display an initial. Add new photos to that directory and update both `rsverona.html` and `it/rsverona.html`.
