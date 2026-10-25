# Saurav Kumar — AEM Developer Portfolio

A responsive portfolio focused on selected work, career experience, and AEM expertise. Built with semantic HTML, CSS, and vanilla JavaScript; no build step or external runtime dependencies.

## Page structure

- **Introduction:** a short profile, architecture illustration, and career summary.
- **Selected work:** four expandable project rows with challenges, approaches, contributions, and example code.
- **Oak demo:** an optional expandable query simulator. All timings and plans are illustrative, not production benchmarks.
- **Experience:** three concise role summaries with expandable full responsibilities.
- **Expertise:** five grouped skill rows and an optional selector retaining all 13 technical examples.
- **Background:** education, awards, and languages without individual cards.
- **Contact:** direct email, phone, LinkedIn, and email copying.

The header links directly to the original resume PDF. Light and dark themes persist locally. The mobile navigation and native disclosure controls support keyboard use, with visible focus indicators and reduced-motion support.

The previous skill chart, repeated summary cards, experience filters, resume modal, and outreach composer have been replaced by simpler sections and direct actions.

## Files

- [index.html](./index.html): page structure and navigation.
- [css/styles.css](./css/styles.css): responsive layout, themes, and print styles.
- [js/app.js](./js/app.js): data rendering, theme, mobile menu, code copying, and query demo.
- [js/data.js](./js/data.js): original profile, career, skill, blueprint, and demo data.
- [assets/](./assets/): existing images and original resume PDF.

## Preview

Open [index.html](./index.html) directly in a modern browser. No installation is required.

Alternatively, with Python 3 installed:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080. Clipboard access depends on browser permissions and secure-context support; if unavailable, the page prompts visitors to copy the visible text manually.

## Editing content

Update career details, technical examples, education, and awards in [js/data.js](./js/data.js). Short project titles and role summaries live in [js/app.js](./js/app.js); introductory text and contact links live in [index.html](./index.html).

## Portfolio with LinkLens

The Selected Work section includes LinkLens with a **Try LinkLens** link. To run the portfolio and the working checker together:

```sh
ruby link-checker/server.rb
```

Open http://127.0.0.1:8081/ for the portfolio. The app is at http://127.0.0.1:8081/link-checker/public/ and includes a return link to the portfolio. The existing **Run LinkLens** VS Code task starts both.

A static preview can display the portfolio and app interface, but cannot run link scans. Public deployment requires hosting the Ruby backend (or routing `/api/scan` to a deployed backend). No public deployment is configured by these local changes.
