import { useEffect, useState } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to view your watchlist.');
        return;
      }

      try {
        const res = await axios.get('/user/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const movieDetails = await Promise.all(
          res.data.map(async (movie) => {
            try {
              const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.movieId}`, {
                params: { api_key: TMDB_API_KEY },
              });

              return {
                ...movie,
                genre: tmdbRes.data.genres.map((g) => g.name).join(', '),
                releaseDate: tmdbRes.data.release_date ? tmdbRes.data.release_date.split('-')[0] : 'N/A',
              };
            } catch {
              return { ...movie, genre: 'Not available', releaseDate: 'N/A' };
            }
          })
        );

        setWatchlist(movieDetails);
      } catch (err) {
        setMessage('Failed to load watchlist.');
      }
    };

    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (movieId, title) => {
    const confirm = window.confirm(`Are you sure you want to remove "${title}" from your watchlist?`);
    if (!confirm) return;

    const token = localStorage.getItem('token');
    setLoadingId(movieId);
    try {
      await axios.delete(`/user/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(watchlist.filter((movie) => movie.movieId !== movieId));
      toast.success(`"${title}" removed from watchlist`);
    } catch (err) {
      toast.error('Failed to remove movie from watchlist');
    } finally {
      setLoadingId(null);
    }
  };

  if (message) {
    return <p className="text-center mt-10 text-red-600">{message}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-center" />
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">📺 My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="text-center text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {watchlist.map((movie) => (
            <div
              key={movie.movieId}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transform hover:scale-105 transition duration-300 relative"
            >
              <Link to={`/movie/${movie.movieId}`}>
                <img
                  src={
                    movie.posterPath
                      ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800">{movie.title}</h2>
                <p className="text-sm text-gray-600">Genre: <i>{movie.genre || 'Not available'}</i></p>
                <p className="text-sm text-gray-600">Year: <i>{movie.releaseDate || 'N/A'}</i></p>
                <button
                  onClick={() => removeFromWatchlist(movie.movieId, movie.title)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-all"
                  disabled={loadingId === movie.movieId}
                >
                  {loadingId === movie.movieId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
