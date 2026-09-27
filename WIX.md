# Showing the site on Wix (one Wix page per site page)

The site stays hosted on GitHub Pages. Each Wix page shows one page of the site
inside an **Embed HTML** element (an iframe). Wix provides the header, footer and
menu; the site hides its own when it detects it is inside Wix.

## 1. Publish the site on GitHub Pages

See "Publish with GitHub Pages" in `README.md`. Note the address, for example
`https://YOUR-USERNAME.github.io/rs-verona-2026/`.

## 2. Create the Wix pages

Create one Wix page per site page. Suggested addresses:

| Site page            | Wix page (example)        |
| -------------------- | ------------------------- |
| `index.html`         | `/rs-verona`              |
| `rsverona.html`      | `/rs-verona/about`        |
| `topics.html`        | `/rs-verona/topics`       |
| `me-in-eyp.html`     | `/rs-verona/me-in-eyp`    |
| `contacts.html`      | `/rs-verona/contacts`     |
| `hub.html`           | `/rs-verona/hub`          |
| `it/index.html`      | `/it/rs-verona` (etc.)    |

## 3. Add the embed to each Wix page

1. Add a section that fills the screen, with nothing else in it.
2. Add **Embed Code → Embed HTML**, choose **Website address** and paste the
   GitHub Pages address of the page, e.g.
   `https://YOUR-USERNAME.github.io/rs-verona-2026/topics.html`.
3. Stretch it to the full width of the section and give it the full height of
   the screen minus the Wix header (the page scrolls *inside* the embed).
4. Check the mobile view in the Wix editor and repeat the same sizing there.

Why full-screen: a Wix embed has a fixed height and cannot grow with its content.
A screen-high embed that scrolls internally keeps the sticky header, dialogs,
parallax and mobile layout working.

## 4. Connect the links

Open `assets/script.js` and fill `WIX_PAGES` at the top with the full Wix address
of each page, e.g.

```js
"contacts.html": "https://www.eypitaly.org/rs-verona/contacts",
```

Then push to GitHub. Inside Wix, links to mapped pages open the Wix page (the
whole browser tab); pages left empty keep opening inside the embed. Email links
open the mail app.

## 5. Things the Wix menu must now provide

Because the site header is hidden inside Wix, add these to the Wix menu/header:
- the EN / IT language switch (link to the English and Italian Wix pages);
- "Event's Hub" and "Back to EYP Italy".

## Preview without Wix

Open any page with `?embed=1` (e.g. `index.html?embed=1`) to see it as it will
look inside Wix.

## Known limits

- Google indexes the content of the embed poorly (it belongs to github.io, not
  to the Wix page).
- The Wix page address does not change when someone navigates to an unmapped
  page inside the embed.
