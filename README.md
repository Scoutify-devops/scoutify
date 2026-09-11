# Scoutify

A modern YouTube-style football talent discovery website built with HTML, CSS, and JavaScript.

## Project overview

Scoutify is a static front-end project inspired by YouTube. It showcases a football video feed, creator/profile pages, search and category filters, dark mode, and a video modal player.

## Project structure

- `index.html` – homepage and main video feed
- `pages/profile.html` – profile page for creators
- `assets/css/styles.css` – site styling and layout
- `assets/js/script.js` – data, filtering, theme toggle, and profile logic
- `.github/workflows/run-scoutify.yml` – GitHub Pages deployment workflow

## Features

- YouTube-style video layout
- Search and category filtering
- Dark mode toggle
- Creator profile page
- Responsive design
- GitHub Pages deployment support

## Run locally

Use Python to serve the site:

```bash
python -m http.server 8000
```

Then go to:

```text
http://localhost:8000
```

## Deploy to GitHub Pages

1. Push the project to the `main` branch.
2. Go to GitHub repository settings.
3. Open `Pages`.
4. Set `Source` to `GitHub Actions`.
5. The workflow in `.github/workflows/run-scoutify.yml` will deploy the site.

## Notes

This project is a front-end static website and is ideal for learning UI design, layout, responsive development, and static hosting.
