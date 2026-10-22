import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import useFetchPhotos from './hooks/useFetchPhotos';
import PhotoCard from './components/PhotoCard';

const STORAGE_KEY = 'frameit_favourites';

/**
 * Safely initializes favourites state from localStorage.
 * Handles missing keys or invalid JSON gracefully.
 */
function loadInitialFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load favourites from localStorage:', error);
    return [];
  }
}

/**
 * Reducer function managing the favourites list.
 * Enforces immutable updates and prevents duplicate IDs.
 */
function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const id = action.payload;
      return state.includes(id)
        ? state.filter((favId) => favId !== id)
        : [...state, id];
    }
    case 'ADD_FAVOURITE': {
      if (state.includes(action.payload)) return state;
      return [...state, action.payload];
    }
    case 'REMOVE_FAVOURITE': {
      return state.filter((favId) => favId !== action.payload);
    }
    default:
      return state;
  }
}

/**
 * Gallery component — the core Photo Gallery Web App.
 * Uses useFetchPhotos, useReducer for favourites, and performance hooks.
 */
export default function Gallery() {
  // Custom hook extracting remote photo retrieval logic
  const { photos, loading, error } = useFetchPhotos();

  // Search input state (search query string)
  const [searchQuery, setSearchQuery] = useState('');

  // Manage favourites collection with useReducer for atomic state transitions
  const [favourites, dispatchFavourites] = useReducer(
    favouritesReducer,
    [],
    loadInitialFavourites
  );

  // Persist favourited photos to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.error('Failed to persist favourites to localStorage:', err);
    }
  }, [favourites]);

  // Memoized search filter input handler
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handler to clear search query
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Handler to toggle favourite status using useReducer dispatch
  const handleToggleFavourite = useCallback((photoId) => {
    dispatchFavourites({ type: 'TOGGLE_FAVOURITE', payload: photoId });
  }, []);

  // Memoized filtered photo list by author name
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-[#f8fcfa] to-[#f2faf7] text-slate-900 flex flex-col antialiased">
      {/* Header & Sticky Top Search Bar */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-teal-100/80 shadow-[0_2px_12px_rgba(13,148,136,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Heading */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-teal-500/25 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2.5" />
                <circle cx="9" cy="9" r="2.2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  Frame<span className="text-teal-600">It</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                  Gallery
                </span>
              </div>
              <p className="text-xs text-teal-800/80 font-medium">
                Curated photography collection
              </p>
            </div>
          </div>

          {/* Real-time author search input */}
          <div className="w-full md:w-96">
            <label htmlFor="search-author" className="sr-only">
              Filter photos by author name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="search-author"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by author name in real-time..."
                className="w-full pl-10 pr-9 py-2.5 bg-teal-50/40 border border-teal-200/90 rounded-xl text-sm text-slate-900 placeholder-teal-600/50 focus:outline-hidden focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-400 hover:text-teal-700 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Loading spinner while fetching */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-teal-700">
            <div className="relative w-14 h-14">
              <div className="w-14 h-14 rounded-full border-3 border-teal-200 border-t-teal-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-teal-500/25 animate-ping" />
              </div>
            </div>
            <p className="mt-5 text-sm font-semibold tracking-wide text-teal-800">
              Fetching 30 curated photos...
            </p>
          </div>
        )}

        {/* Error message state if the fetch fails */}
        {!loading && error && (
          <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-white border border-rose-200 rounded-2xl text-center shadow-[0_8px_24px_rgba(244,63,94,0.08)]">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Failed to load photos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Real-time search filter — Empty result state */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="max-w-md mx-auto py-24 text-center">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-200/70 text-teal-600 shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-900">
              No matching photos found
            </p>
            <p className="text-sm text-slate-500 mt-1">
              No photos match the author &ldquo;{searchQuery}&rdquo;. Try another name.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-5 inline-flex items-center text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 px-4 py-2 rounded-xl shadow-sm shadow-teal-600/25 transition-all cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        )}

        {/* Responsive Grid: Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
