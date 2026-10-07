# Neu CMS

Neumorphism CMS dashboard. Tailwind CSS v4.3 (CLI).

```bash
npm install
npm run dev     # watch + build dist/output.css
npm run build   # minified build
```

Then open `index.html` in the browser.

## Structure

```
index.html
src/css/app.css         entry (imports only)
src/css/theme.css       tokens: colors, shadows, radius, dark mode
src/css/base.css        base styles
src/css/components.css  neu-card, neu-btn, neu-input, ...
src/js/main.js          dark mode toggle
```
