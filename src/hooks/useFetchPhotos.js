import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch 30 photos from Picsum API on mount.
 * Returns { photos, loading, error }
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load photos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'An error occurred while fetching photos.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      controller.abort();
    };
  }, []);

  return { photos, loading, error };
}

export default useFetchPhotos;
