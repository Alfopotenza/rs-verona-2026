# RS Verona 2026 — static website

Website for RS Verona 2026, a Regional Session of the European Youth Parliament.

The site uses only HTML, CSS and JavaScript. It has no build step and is ready for GitHub Pages.

## Site structure

The site is split into a **showcase** part (English + Italian) and an **Event's Hub** (English only, for delegates and staff during the session).

```
index.html                 Home — hero, countdown and session essentials
rsverona.html              About RS Verona — vision, team and partners
topics.html                Committee topics
me-in-eyp.html             How to stay involved after the session
contacts.html              Contacts, preparation, safeguarding and FAQ
hub.html                   Event's Hub — schedule, venues, materials and contacts
it/                        Italian versions of the five showcase pages (same filenames)
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
<a class="material-row" href="./documents/welcome-booklet.pdf">
  <!-- row content -->
</a>
```

Relative paths beginning with `./` (or `../` inside `it/`) are intentional: they allow the
site to work both at `username.github.io` and at `username.github.io/repository-name/`.

### Partners

The Partners section in `rsverona.html` and `it/rsverona.html` lists confirmed supporters. Update both languages when partnerships change; use the session mailbox for partnership enquiries.

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
