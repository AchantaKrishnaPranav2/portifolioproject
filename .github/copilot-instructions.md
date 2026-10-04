# Copilot Instructions

## Project
- This is a static photography portfolio built with plain HTML, CSS, and vanilla JavaScript; there is no framework, package manifest, or build setup.
- `index.html` contains the page structure and references `css/variables.css`, `css/style.css`, and `js/main.js`.
- Keep site images in `images/` and reference them with relative paths.

## Conventions
- Keep design tokens such as colors, typography, spacing, and breakpoints in `css/variables.css`; use those variables from `css/style.css`.
- Keep page content and semantic structure in `index.html`, presentation in CSS, and interactive behavior in `js/main.js`.
- Use vanilla JavaScript and the existing DOM hooks/classes for interactions. The `js/` directory is currently empty, although `index.html` includes `js/main.js`.
- Preserve the portfolio's dark, crimson-accented visual identity and its existing responsive layout.
- Preserve semantic HTML, descriptive image alt text, visible focus states, ARIA state/labels, keyboard access, and reduced-motion support when changing interactive UI.
- Prefer small, focused changes and avoid adding dependencies or build tooling unless the task requires them.

## Validation
- There is currently no automated test or build command. For visual or interaction changes, verify the page in a browser at desktop and mobile widths; check the browser console and confirm local image paths load.