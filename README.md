# MyPortfolio

Personal portfolio site for **James Wolfe** — software developer (backend, data engineering, Python & TypeScript) based in Lapu-Lapu City, Cebu.

**Live:** https://james-wolfe-04.github.io/portfolio/

## Stack

A single self-contained HTML file. No build step, no dependencies, no framework — CSS and JavaScript are inlined, and icons are an inline SVG sprite. The only external requests are the Inter and JetBrains Mono webfonts.

## Structure

```
docs/
├── index.html                        # the entire site — markup, styles, scripts
├── profile.png                       # headshot used in the hero card
├── Resume.pdf                        # served by the "Download Resume" buttons
├── cert-aws-cloud-*.jpg              # full-size certificates, opened by the lightbox
└── cert-aws-cloud-*-thumb.jpg        # card previews
```

GitHub Pages serves this repo from the `docs/` folder on `main`.

## Local development

Open `docs/index.html` in a browser — that's the whole workflow. To exercise it over HTTP instead:

```bash
python -m http.server -d docs 8000
```

## Design notes

- **Light-first, dark on request.** Tokens are defined once on `:root`; `:root[data-theme="dark"]` overrides only the colours. An inline script in `<head>` resolves the saved or system theme before first paint, so there is no flash. The nav toggle writes the choice to `localStorage` under `jw-theme`; without a stored choice the page follows the OS.
- **Written for hiring managers.** The page front-loads what a reviewer scans for — title, availability, location, resume link, then a metrics band, then achievement-led experience bullets. Every claim maps to something in `Resume.pdf`.
- **Progressive enhancement.** Reveal animations only hide content once JS has added `.js` to `<html>`, and everything degrades to plain scrollable HTML without it. `prefers-reduced-motion` is honoured, and there is a print stylesheet.
- **Structured data.** A `Person` JSON-LD block in `<head>` keeps the title, employer, skills, and profile links machine-readable.
- **Credential gallery.** The AWS certificates are shown as real images rather than a text label, each with course hours, issue date, and a Credly verification link. Clicking one opens a lightbox (Esc, backdrop click, or the Close button dismisses it; focus returns to the thumbnail and body scroll is locked while open). Note that `.cert-card__shot img` needs an explicit `height: auto` — the `width`/`height` attributes land as a presentational height, and `aspect-ratio` only fills in a *missing* dimension, so without it the thumbnails render at their natural height and crop.
- **Brand marks in the stack chips.** Logos come from [Simple Icons](https://simpleicons.org/) (CC0), inlined into the SVG sprite as `l-*` symbols — no runtime dependency. They are solid-fill paths, so they use `fill` and must *not* carry the stroke-based `.icon` class. Each chip's colour comes from a `[data-logo="…"] { --brand: … }` rule; keep those in the stylesheet rather than inline `style` attributes, or the per-theme overrides can never win the cascade. A handful of marks fail contrast on one background (AWS, Java and Next.js are near-black; JavaScript, Linux and React are near-white), so the two `:root[data-theme=…]` blocks swap in a legible variant. Any mark with no published brand colour falls back to `currentColor`.

## Updating content

Everything lives in `docs/index.html`, organised in commented sections (Hero, Metrics, About, Experience, Skills, Work, Credentials, Contact). Design tokens — colours, spacing, radii, type — are CSS custom properties in the `:root` block at the top of the `<style>` tag.

Skill and stack chips use two weights: `tag--key` for the daily-driver technologies, plain `tag` for everything else. Keep that distinction meaningful — it is the fastest signal on the page.

To swap the resume, replace `docs/Resume.pdf`; every download button already points at it.

To add a certificate, render the PDF to JPG (a full-size one capped around 1600px and a `-thumb` around 720px), drop both in `docs/`, and copy an existing `.cert-card` block — the lightbox picks it up automatically from `data-full` and `data-caption`. Credentials with no certificate image go in the `.also` card instead, so the gallery stays visually consistent.
