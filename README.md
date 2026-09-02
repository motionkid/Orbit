# Orbit

**Orbit is a business validation workspace.**  
The product turns a rough business idea into a structured customer thesis, opportunity signals, unit economics, risk analysis, scenario testing, and a first launch plan.

> Current version: V1.2 prototype — no API or backend required.

## Why this prototype exists

Orbit is intentionally not a generic AI business-plan generator. The product philosophy is:

**Idea → assumptions → evidence → simulation → experiment → launch**

The first version is a self-contained browser app. It uses deterministic local logic so the interface can be tested and demonstrated without API credits.

## Run locally

No build step is required.

1. Download/clone this repository.
2. Open `index.html` in a browser.

For the best local development experience, use any simple static server, for example VS Code Live Server.

## GitHub Pages

This repository is compatible with GitHub Pages because it is a static site.

- Push the files to a GitHub repository.
- Go to **Settings → Pages**.
- Select the main branch and `/root`.
- Save.

## Product structure

- `index.html` — application structure
- `styles.css` — product UI and responsive layout
- `app.js` — local business model, scoring, scenario logic and export

## V1 limitations

The current prototype intentionally does **not** claim to provide live market research or real financial forecasts. Values are clearly presented as initial modelled assumptions.

The next production layer should add:
- real source-backed market research
- an AI extraction layer that converts arbitrary ideas into a structured business model
- persistent projects/accounts
- stronger financial modelling
- experiment tracking
- generated launch assets
- server-side validation and security

## Design principles

1. **Evidence over confidence**
2. **Assumptions are visible**
3. **Every risk should lead to a test**
4. **No giant walls of AI text**
5. **The interface should feel like a professional venture workspace, not a template marketplace**

## License

Add the license you want before public launch.
