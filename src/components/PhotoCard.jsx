import React from 'react';

/**
 * PhotoCard component renders an individual photo item with author details
 * and a heart icon button to toggle favourite status.
 *
 * Props:
 * - photo: { id, author, download_url, width, height }
 * - isFavourite: boolean
 * - onToggleFavourite: (id: string) => void
 */
export function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  const handleToggle = () => {
    onToggleFavourite(photo.id);
  };

  return (
    <article className="group bg-white rounded-2xl border border-teal-100/80 shadow-[0_2px_12px_rgba(13,148,136,0.05)] hover:shadow-[0_12px_28px_rgba(13,148,136,0.15)] hover:border-teal-300/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full bg-teal-50/40 overflow-hidden">
        <img
          src={photo.download_url}
          alt={`Photo taken by ${photo.author}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Heart Icon Button */}
        <button
          type="button"
          onClick={handleToggle}
          title={isFavourite ? 'Remove from favourites' : 'Mark as favourite'}
          aria-label={
            isFavourite
              ? `Remove photo by ${photo.author} from favourites`
              : `Add photo by ${photo.author} to favourites`
          }
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs hover:bg-white hover:shadow-md active:scale-90 transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-teal-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-all duration-200 ${
              isFavourite
                ? 'fill-rose-500 stroke-rose-500 scale-105 drop-shadow-[0_2px_6px_rgba(244,63,94,0.3)]'
                : 'fill-none stroke-slate-500 hover:stroke-rose-500'
            }`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Card Footer: Photographer Info & ID Badge */}
      <div className="p-4 flex items-center justify-between gap-3 mt-auto bg-white border-t border-teal-50/60">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600">
            Photographer
          </p>
          <h2
            className="text-sm font-bold text-slate-900 group-hover:text-teal-950 transition-colors truncate mt-0.5"
            title={photo.author}
          >
            {photo.author}
          </h2>
        </div>
        <span className="text-[11px] font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 shrink-0">
          #{photo.id}
        </span>
      </div>
    </article>
  );
}

export default PhotoCard;
