# NASA Image Search App

A React-based web application that lets users search NASA's public Image and Video Library by keyword and year range, displaying results in a responsive masonry-style photo gallery with full-screen lightbox support.

---

## Features

- **Keyword search** — query NASA's Image and Video Library API by any text term
- **Year range filtering** — narrow results by start and end year (1850–2026) via dropdown selectors
- **"I'm Feeling Lucky" button** — generates a random search term and random year range, then immediately runs the search
- **Masonry photo gallery** — results displayed using `react-photo-album` in a rows layout
- **Full-screen lightbox** — click any image to open it in a lightbox with fullscreen, thumbnail strip, and caption support via `yet-another-react-lightbox`
- **Global state management** — photo results are stored in a Zustand store, decoupling state from component hierarchy
- **CORS proxy** — a Vite dev server proxy routes API requests through `/nasa-api` to avoid CORS issues when running locally

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| State Management | Zustand 5 |
| Photo Gallery | react-photo-album 3 |
| Lightbox | yet-another-react-lightbox 3 |
| Linting | ESLint 10 |
| API | NASA Image and Video Library |

---

## Project Structure

```
src/
├── App.jsx                  # Root component, sets up BrowserRouter and routes
├── App.css                  # Global styles
├── index.css                # Base CSS reset / variables
├── main.jsx                 # React entry point
├── pages/
│   └── HomePage.jsx         # Main page — search controls, state, and API logic
├── components/
│   ├── ImageGallery.jsx     # Renders the photo album and lightbox
│   └── YearPicker.jsx       # Reusable year dropdown component (1850–2026)
├── store/
│   └── usePhotoStore.js     # Zustand store for photos and lucky search strings
└── assets / images/         # Static image assets
```

### Key Component Responsibilities

**`HomePage.jsx`** owns all search state (`searchString`, `startYear`, `endYear`) and contains the two main functions:
- `performDynamicSearch()` — builds the API query using `URLSearchParams`, fetches from the proxied NASA endpoint, parses `imgData.collection.items`, and updates the global photo store
- `generateLuck()` — picks a random search term and random bounded year range using `Math.random()` / `Math.floor()`, then calls `performDynamicSearch()`

**`ImageGallery.jsx`** reads photos from the Zustand store and renders `RowsPhotoAlbum` with a click handler that opens the `Lightbox` at the selected index. Lightbox plugins enabled: `Fullscreen`, `Captions`, `Thumbnails`.

**`YearPicker.jsx`** is a reusable controlled dropdown. It generates year options from 2026 down to 1850 using an IIFE `for` loop inside JSX, accepting `yearValue` and `yearSetter` as props for two-way binding with the parent.

**`usePhotoStore.js`** is a Zustand store holding the `photos` array (used globally to avoid prop drilling) and the `luckySearchStrings` pool.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

---

## Installation & Running Locally

**1. Clone or extract the project**

```bash
# If cloning from a repository:
git clone <repo-url>
cd CloudMasonry_DevAssignment

# Or if working from the extracted zip, navigate into the project folder:
cd CloudMasonry_DevAssignment
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default. The Vite dev server is configured with a proxy that forwards requests from `/nasa-api` to `https://images-api.nasa.gov`, which is required to avoid CORS errors when calling the API from localhost.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Build the app for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## API

This app uses the [NASA Image and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf). The search endpoint used is:

```
GET https://images-api.nasa.gov/search?media_type=image&q={query}&year_start={year}&year_end={year}
```

Requests are made with an `api_key` header. In local development, all requests are routed through the Vite proxy at `/nasa-api` to avoid CORS restrictions.

---

## Notes

- Image dimensions (`width`/`height`) from the NASA API response may be undefined for some results; `react-photo-album` handles missing dimensions gracefully.
- The lucky search string pool is defined in the Zustand store (`usePhotoStore.js`) and can be extended by updating the `luckySearchStrings` array.
