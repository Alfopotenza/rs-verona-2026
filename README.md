# RS Verona 2026 — static website

Static participant hub for the RS Verona 2026 Regional Session of the European Youth Parliament.

The site uses only HTML, CSS and JavaScript. It has no build step and is ready for GitHub Pages.

## Local preview

From this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Edit the site

- Page content: `index.html`
- Colours and layout: `assets/styles.css`
- Interactive schedule: `assets/script.js`
- Logo and images: `assets/images/`
- Future PDF booklets: `documents/`

When a booklet is ready, add the PDF to `documents/` and replace the corresponding material row in `index.html` with a link. Always use relative links, for example:

```html
<a class="material-row" href="./documents/travel-booklet.pdf">
  <!-- row content -->
</a>
```

Relative paths beginning with `./` are intentional: they allow the site to work both at `username.github.io` and at `username.github.io/repository-name/`.

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
2. Replace the relevant `person-photo` block in `index.html` with an image.
3. Add meaningful alternative text with the person’s name.
