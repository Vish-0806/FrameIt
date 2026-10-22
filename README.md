# FrameIt — Curated Photo Gallery

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**FrameIt** is a modern, responsive, and performance-focused photo gallery application built with React 19, Tailwind CSS v4, and Vite. It provides an intuitive platform to explore curated photography, perform instant real-time photographer searches, and bookmark favorite shots with seamless local persistence.

---

## ✨ Features

- **📸 Curated Photography Stream**: Fetches high-resolution imagery dynamically from the Picsum Photos API with author attribution and aspect-ratio preservation.
- **⚡ Instant Real-Time Search**: Filter photos on the fly by photographer name. All searches run client-side with zero latency, zero re-fetches, and an interactive clear button.
- **❤️ Favourites Collection**: Toggle favourite photos with a single tap. Heart animations provide tactile feedback, and your collection is automatically persisted across browser reloads using `localStorage`.
- **📐 Fully Responsive Layout**: Built with a mobile-first philosophy, adapting smoothly from a 1-column mobile view to 2 columns on tablets and 4 columns on desktop displays.
- **🛡️ Robust Error & Loading States**: Clean animated spinner during data fetching, accompanied by graceful error handling with a retry trigger if network requests fail.
- **✨ Polished Aesthetics & Micro-Interactions**: Glassmorphic sticky header, refined teal color accents, image hover-zoom effects, and Plus Jakarta Sans typography.

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| **[React 19](https://react.dev/)** | Frontend library utilizing hooks (`useReducer`, `useMemo`, `useCallback`, `useState`, `useEffect`) |
| **[Vite](https://vitejs.dev/)** | Next-generation frontend tooling for instant HMR and optimized production bundles |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Modern utility-first CSS framework with native `@tailwindcss/vite` integration |
| **[Picsum Photos API](https://picsum.photos/)** | Curated, high-fidelity photo service supplying image assets and metadata |
| **[Oxlint](https://oxc.rs/)** | High-speed JavaScript/JSX linter for code health and standards enforcement |

---

## 📂 Project Structure

```text
FrameIt/
├── public/
│   └── favicon.svg              # Custom camera lens & photo frame SVG icon
├── src/
│   ├── components/
│   │   └── PhotoCard.jsx        # Presentation card: image, author info, and favourite button
│   ├── hooks/
│   │   └── useFetchPhotos.js    # Custom data-fetching hook with AbortController lifecycle safety
│   ├── App.jsx                  # Main gallery view: header, search filter, grid, and useReducer
│   ├── index.css                # Base stylesheet and Tailwind CSS v4 directives
│   └── main.jsx                 # Application entry point and DOM root mount
├── index.html                   # HTML template with Google Fonts (Plus Jakarta Sans)
├── package.json                 # Project dependencies, build scripts, and metadata
├── vite.config.js               # Vite bundler configuration with Tailwind plugin
└── README.md                    # Project documentation
```

---

## 🧠 Engineering Highlights

### 1. Custom Data Fetching Hook (`useFetchPhotos`)
All remote communication is encapsulated inside a reusable `useFetchPhotos` hook. It handles asynchronous data retrieval, manages loading/error states, and utilizes an `AbortController` to cancel in-flight network requests on unmount, avoiding memory leaks or stale state updates.

### 2. Predictable State with `useReducer`
Photo bookmarking is driven by React's `useReducer` instead of basic state setters. This centralizes state transition rules (`TOGGLE_FAVOURITE`, `ADD_FAVOURITE`, `REMOVE_FAVOURITE`), guarantees immutable updates, and prevents duplicate entries.

### 3. Smart Persistence (`localStorage`)
The favourites list initializes lazily on startup from browser storage via `loadInitialFavourites()`. Any subsequent dispatch triggers an isolated side effect that serializes the state to `localStorage`, keeping user preferences intact across sessions without layout shifts.

### 4. Render & Compute Optimization
- **`useMemo`**: Derives the filtered photo list from the current search query, preventing expensive recalculations during unrelated renders (e.g. toggling favourite hearts).
- **`useCallback`**: Memoizes event handlers to provide stable references across component re-renders.
- **Native Lazy Loading**: Image tags include `loading="lazy"` to defer off-screen asset downloads and optimize bandwidth.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.0.0 or later) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vish-0806/FrameIt.git
   cd FrameIt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite dev server with instant Hot Module Replacement (HMR) |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs Oxlint to identify code style issues and potential bugs |

---

## ♿ Accessibility & UX

- **Keyboard Navigable**: All interactive controls (search input, clear action, heart buttons) include standard keyboard focus states with high-contrast rings.
- **Screen Reader Support**: Semantic HTML (`<header>`, `<main>`, `<article>`) coupled with descriptive `aria-label` attributes on dynamic buttons.
- **Responsive Typography**: Scaled with fluid sizes and comfortable line heights for effortless reading on any screen size.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
