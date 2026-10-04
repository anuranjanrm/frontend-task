# PACELINE — Running Co. Website

A responsive two-page website (Home + About) built with semantic HTML, CSS and vanilla JavaScript.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server, e.g.:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Structure

```
├── index.html        # Home page
├── about.html        # About / Our Story page
├── css/styles.css    # Shared stylesheet (design tokens, responsive layout)
├── js/main.js        # Mobile nav, product filters, wishlist, bag counter, forms
├── assets/           # Images provided by the task brief
└── README.md
```

## Features

- Fully responsive layout (desktop / tablet / mobile breakpoints)
- Mobile navigation menu toggle
- Product filter pills (New In / Best Sellers / Race Day / Trail)
- Wishlist hearts and shopping-bag counter
- Newsletter signup with inline confirmation
- Map image of the Glasgow store location, lazy-loaded imagery, semantic landmarks, aria labels and alt text for accessibility

## Deploy

Deploy as a static site on Netlify, Vercel, GitHub Pages or Firebase Hosting — no build step required.

© 2026 Paceline Running Co.
