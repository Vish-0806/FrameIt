# FrameIt — Photo Gallery Web App

A clean, responsive photo gallery web application built for the **Celebrare Frontend React Internship Pre-Screening Assignment**.

Live Demo: Running locally at `http://localhost:5173/`

---

## 📌 Requirements Fulfillment Summary

| # | Requirement | Implementation | Status |
|---|---|---|---|
| **1** | **Project Setup** | Built with React 19 + Vite. Styled purely with Tailwind CSS. Zero component libraries (no MUI, Bootstrap, or Ant Design). | ✅ Complete |
| **2** | **Fetch Photos from API** | Fetches 30 photos on load from `https://picsum.photos/v2/list?limit=30` via browser native `fetch`. Visible loading spinner and clear error message state. | ✅ Complete |
| **3** | **Responsive Grid** | Desktop: 4 columns (`lg:grid-cols-4`). Tablet: 2 columns (`sm:grid-cols-2`). Mobile: 1 column (`grid-cols-1`). Each card contains photo, author name, and an interactive heart button. | ✅ Complete |
| **4** | **Search Filter** | Real-time author search at the top. Case-insensitive matching. Zero page reload. Zero API calls on search (filters already-fetched data). Graceful empty state when no author matches. | ✅ Complete |
| **5** | **Favourites with `useReducer`** | Heart icon toggles favourite status. Managed exclusively through `useReducer` (no `useState` for favourites). Persisted across page refreshes using `localStorage`. | ✅ Complete |
| **6** | **Custom Hook (`useFetchPhotos`)** | Extracted fetch logic into `src/hooks/useFetchPhotos.js`. Returns exactly `{ photos, loading, error }`. The `Gallery` component uses this hook instead of fetching directly. | ✅ Complete |
| **7** | **`useCallback` + `useMemo`** | `useCallback` wraps the search filter handler. `useMemo` computes the filtered photo list from in-memory state. | ✅ Complete |

---

## 📂 Project Architecture

```text
frameit/
├── public/
│   └── favicon.svg              # Custom FrameIt camera & frame icon
├── src/
│   ├── components/
│   │   └── PhotoCard.jsx        # Functional card with photo, author, and heart button
│   ├── hooks/
│   │   └── useFetchPhotos.js    # Custom hook returning { photos, loading, error }
│   ├── App.jsx                  # Gallery component with search, favourites useReducer, and grid
│   ├── index.css                # Tailwind CSS v4 entry point & base typography
│   └── main.jsx                 # React root mount
├── index.html                   # HTML entry with Plus Jakarta Sans & FrameIt title
├── package.json                 # Minimal dependencies (React + Tailwind CSS)
├── vite.config.js               # Vite config with @tailwindcss/vite plugin
└── README.md
```

---

## 🚀 Running the App Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite dev server
npm run dev

# 3. Production build
npm run build
```

---

## 🎙️ 5-Minute Screen Recording Script & Guide

Use this structured guide during your 5-minute recording to address all rubric points:

### 1. Show the App Working (1:00 min)
- Open `http://localhost:5173/` in the browser.
- Point out the initial load with the spinner before the 30 photos display.
- Type `"Alejandro"` in the search bar: show photos filtering instantly in real-time.
- Type `"xyz123"`: show the friendly empty state message and click "Clear search filter".
- Click heart icon on 2–3 cards: show them turning into filled rose hearts with tactile feedback.
- Refresh the browser (F5): show that the favourited hearts remain filled (persisted in `localStorage`).

### 2. Open `src/hooks/useFetchPhotos.js` (1:00 min)
- **What does it return?**: An object with exactly three properties: `photos` (array), `loading` (boolean), and `error` (string or null).
- **What happens if the API fails?**: If the response is not `ok` (e.g., HTTP 500 or 404) or a network failure happens, an error is caught, `error` state is updated with a user-friendly message, and `loading` is set to `false`. An `AbortController` handles unmount cleanup so aborted requests do not update unmounted component state.

### 3. Open `src/App.jsx` — `useReducer` Code (1:00 min)
- **What actions does your reducer handle?**: `TOGGLE_FAVOURITE` (as well as `ADD_FAVOURITE` / `REMOVE_FAVOURITE`). It checks if the photo ID is already present; if yes, it filters it out; if no, it appends it immutably.
- **Why use `useReducer` instead of `useState`?**:
  1. **Separation of State Logic**: It extracts state transition logic outside of the component body, making the state predictable and pure.
  2. **Complex State Transitions**: Toggling an item in a collection requires conditional membership checks and deduplication; `useReducer` ensures atomic and testable updates without race conditions or multiple `setState` calls.
  3. **Scalability**: As state rules grow, reducers keep state changes centralized in one place.

### 4. Explain `useCallback` and `useMemo` (1:00 min)
- **`useCallback` (on `handleSearchChange`)**:
  - *Problem it solves*: Every time `Gallery` renders, new function instances are ordinarily created. `useCallback` memoizes the function reference so it remains stable across renders.
  - *What would break/happen if removed*: The app would still functionally work, but child inputs or memoized components would receive new function references on every render, triggering unnecessary re-renders.
- **`useMemo` (on `filteredPhotos`)**:
  - *Problem it solves*: Avoids running the `.filter()` operation on all 30 items on unrelated component re-renders (like when favourites are toggled).
  - *What would break/happen if removed*: The entire array filter would execute on every single state change (e.g., each heart toggle), leading to unnecessary CPU cycles as the gallery size grows.

### 5. Show One Thing That Was Difficult & How You Solved It (1:00 min)
- **The Challenge**: Synchronizing `useReducer` with browser `localStorage` during initial mount and updates without flashing empty favourites or running into hydration/parsing mismatches.
- **The Solution**: Used the third argument of `useReducer` (lazy initialization function: `loadInitialFavourites`) which safely reads and parses `localStorage` once on mount inside a `try...catch` block. Combined with an isolated `useEffect` watching `[favourites]`, state updates are saved reliably without blocking renders.
