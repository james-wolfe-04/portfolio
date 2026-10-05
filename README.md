# MyPortfolio

Personal portfolio site for **James Wolfe**, software developer (full-stack TypeScript & Python) based in Lapu-Lapu City, Cebu.

**Live:** https://james-wolfe-04.github.io/portfolio/

## Stack

Hand-written HTML, CSS, and vanilla JavaScript. No build step, no dependencies, no framework — nothing to install and nothing to compile. Icons are an inline SVG sprite; the only external requests are the Inter and JetBrains Mono webfonts.

## Structure

```
.
├── README.md
├── .gitignore
├── resume/
│   ├── resume.html                    # source of Resume.pdf (not served)
│   └── build.py                       # renders it to docs/assets/files/Resume.pdf
└── docs/                              # GitHub Pages document root
    ├── index.html                     # markup only
    └── assets/
        ├── css/
        │   └── main.css               # design tokens + all component styles
        ├── js/
        │   └── main.js                # theme toggle, drawer, scroll-spy, lightbox
        ├── img/
        │   ├── profile/               # hero headshot + its srcset derivative
        │   └── certificates/          # full-size scans and their -thumb previews
        └── files/
            └── Resume.pdf             # served by the "Download Resume" buttons
```

GitHub Pages serves this repo from the `docs/` folder on `main`, so `docs/` is the web root and every path in `index.html` is relative to it.

Two scripts stay inline in `<head>` on purpose, and moving either into `main.js` would break it: the `Person` JSON-LD block, and the theme resolver — it has to set `data-theme` and the `.js` flag *before first paint*, which a deferred external file cannot do without a visible flash.

## Local development

Open `docs/index.html` in a browser — that's the whole workflow; the relative CSS, JS, and image paths all resolve over `file://`. To exercise it over HTTP instead (closer to how Pages serves it):

```bash
python -m http.server -d docs 8000
```

## Design notes

- **"Ember" palette: black and red, with two warm companions.** Red (`--red`) is action and emphasis; ember orange (`--ember`) is the secondary highlight; gold (`--gold`) is reserved for proof and results (impact numbers, "Already done" boxes, the "What changed" column). The three together form the `--grad` flame gradient used on the headline, impact numbers, step badges and the reading-progress bar. Space Grotesk carries display type, Inter carries prose, JetBrains Mono carries labels, counters and chips.
- **Dark-first, light on request.** Tokens are defined once on `:root` (dark); `:root[data-theme="light"]` overrides only the colours with a warm-paper palette. An inline script in `<head>` applies the saved theme before first paint, defaulting to dark regardless of OS setting. The nav toggle writes the choice to `localStorage` under `jw-theme`.
- **Written for hiring managers, outcome first.** The page leads with what James would do for a business (Services), how he solves problems (Approach), then results-led experience where each item states the outcome before the method. Every claim and number maps to `Resume.pdf`; nothing on the page says or implies a current employer.
- **Progressive enhancement.** Reveal animations only hide content once JS has added `.js` to `<html>`, and everything degrades to plain scrollable HTML without it. `prefers-reduced-motion` is honoured, and there is a print stylesheet.
- **Structured data.** A `Person` JSON-LD block in `<head>` keeps the title, employer, skills, and profile links machine-readable.
- **Credential gallery.** Totals come first in a `.cred-stats` strip (certificates, training hours, issuers, most recent award) so the record reads at a glance before any single badge. Each `.cert` card then shows the real scan plus its own spec sheet — issuer, course hours, issue date — and an action: a Credly verification link where one exists, otherwise a `.cert__open` button that opens the same scan the preview does. Clicking either opens the lightbox (Esc, backdrop click, or Close dismisses it; focus returns to whichever element opened it, and body scroll is locked while open).
- **Certificate previews are `contain`, not `cover`.** The scans have different aspect ratios (the AWS ones are ~4:3, the Accenture slide is 16:9), so `.cert__preview` fixes a `3 / 2` box and letterboxes each scan inside it against a light mat — cropping a certificate to fill the box would cut off the text that makes it worth showing. The mat stays light in both themes because a certificate is a printed white document; letterboxing one against a dark surface reads as a rendering bug.
- **`.lightbox` needs its own `[hidden]` rule.** The overlay is `display: grid`, which beats the UA's `[hidden] { display: none }`. Without `.lightbox[hidden] { display: none; }` it stays a transparent `position: fixed` layer over the whole viewport and silently swallows every click on the page.
- **Brand marks in the stack chips.** Logos come from [Simple Icons](https://simpleicons.org/) (CC0), inlined into the SVG sprite as `l-*` symbols — no runtime dependency. They are solid-fill paths, so they use `fill` and must *not* carry the stroke-based `.icon` class. Each chip's colour comes from a `[data-logo="…"] { --brand: … }` rule; keep those in the stylesheet rather than inline `style` attributes, or the per-theme overrides can never win the cascade. A handful of marks fail contrast on one background (AWS, Java and Next.js are near-black; JavaScript, Linux and React are near-white), so the two `:root[data-theme=…]` blocks swap in a legible variant. Any mark with no published brand colour falls back to `currentColor`.

## Updating content

Copy lives in `docs/index.html`, organised in commented sections (Hero, Impact, Services, Approach, Experience, Work, Skills, Credentials, Contact). Styles live in `docs/assets/css/main.css`, in the same order as the markup; design tokens — colours, spacing, radii, type — are CSS custom properties in the `:root` block at the top of that file. Behaviour lives in `docs/assets/js/main.js`.

Skill and stack chips use two weights: `tag--key` for the daily-driver technologies, plain `tag` for everything else. Keep that distinction meaningful — it is the fastest signal on the page.

To update the resume, edit `resume/resume.html` and run `python resume/build.py` (needs Chrome or Edge); it rewrites `docs/assets/files/Resume.pdf`, which every download button already points at. Keep it to one Letter page.

To add a certificate, render it to JPG (a full-size one capped around 1600px and a `-thumb` around 720px wide), drop both in `docs/assets/img/certificates/`, and copy an existing `.cert` block — the lightbox picks it up automatically from `data-full` and `data-caption`. Then update the `.cred-stats` strip, since the certificate count and training-hour total are written into the markup rather than derived. Credentials with no certificate image go in the `.also` card instead, so the gallery stays visually consistent.

The résumé is deliberately **not** in the navbar; it is offered in the hero and in the closing `.cta-panel`, and nowhere else.
