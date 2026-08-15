# MyPortfolio

Personal portfolio site for **James Wolfe** — full-stack developer (data engineering, web scraping, Python & TypeScript) based in Lapu-Lapu City, Cebu.

**Live:** https://james-wolfe-04.github.io/MyPortfolio/

## Stack

A single self-contained HTML file. No build step, no dependencies, no framework — CSS and JavaScript are inlined, and icons are an inline SVG sprite. The only external request is the Inter webfont.

## Structure

```
docs/
├── index.html    # the entire site — markup, styles, scripts
├── profile.png   # headshot used by the hero avatar
└── Resume.pdf    # served by the "Download Resume" buttons
```

GitHub Pages serves this repo from the `docs/` folder on `main`.

## Local development

Open `docs/index.html` in a browser — that's the whole workflow. To exercise it over HTTP instead:

```bash
python -m http.server -d docs 8000
```

## Updating content

Everything lives in `docs/index.html`, organised in commented sections (Hero, About, Experience, Skills, Projects, Education, Contact). Design tokens — colours, spacing, radii, type — are CSS custom properties in the `:root` block at the top of the `<style>` tag.

To swap the resume, replace `docs/Resume.pdf`; both download buttons already point at it.
