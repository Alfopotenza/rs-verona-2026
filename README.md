# RS Verona 2026 — static website

Website for RS Verona 2026, a Regional Session of the European Youth Parliament.

The site uses only HTML, CSS and JavaScript. It has no build step and is ready for GitHub Pages.

## Site structure

The site is split into a **showcase** part (English + Italian) and an **Event's Hub** (English only, for delegates and staff during the session).

```
index.html                 Home — hero, countdown, session essentials, link to the Hub
rsverona.html               About RS Verona — Why Verona?, Vision & goals, Team, Partners, Numbers
me-in-eyp.html               "Me in EYP" — how to stay involved after the session
helpful-information.html     What EYP is, how to prepare, code of conduct, FAQ
contacts.html                General contacts (press, partnerships, EYP Italy)
hub.html                     Event's Hub — schedule, venues & menu, materials, participant contacts

it/                          Italian mirror of the five pages above (same filenames)
```

`hub.html` has no Italian version by design — it's the operational page used during the
session and is kept English-only.

### Adding/editing content

- Showcase pages (EN): edit the file directly in the repository root.
- Showcase pages (IT): edit the matching file in `it/` — same filename, same section IDs.
- Event's Hub: edit `hub.html` only.
- Colours and layout: `assets/styles.css`
- Interactive schedule/countdown: `assets/script.js`
- Logo and images: `assets/images/`
- Future PDF booklets: `documents/`

Every page in `it/` links back to its English counterpart (and vice versa) through the
`EN`/`IT` switch in the header — keep that link updated if you rename a file.

When a booklet is ready, add the PDF to `documents/` and replace the corresponding material row in `hub.html` with a link. Always use relative links, for example:

```html
<a class="material-row" href="./documents/travel-booklet.pdf">
  <!-- row content -->
</a>
```

Relative paths beginning with `./` (or `../` inside `it/`) are intentional: they allow the
site to work both at `username.github.io` and at `username.github.io/repository-name/`.

### Partners

The Partners section on `rsverona.html` (and `it/rsverona.html`) currently has four
placeholder tiles ("Logo & name to be confirmed"). Send over the confirmed partner
names/logos and replace each `.partner-tile` block, e.g.:

```html
<div class="partner-tile">
  <img src="./assets/images/partners/example.png" alt="Example Partner" height="40">
</div>
```

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

The two Head Organiser cards currently use initials. To add photographs:

1. Copy each image into `assets/images/team/`.
2. Replace the relevant `person-photo` block in `rsverona.html` (and `it/rsverona.html`) with an image.
3. Add meaningful alternative text with the person’s name.
