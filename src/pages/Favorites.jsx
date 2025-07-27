import { useEffect, useState } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingId, setLoadingId] = useState(null); 

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to view favorites.');
      return;
    }

    try {
      const res = await axios.get('/user/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      setMessage('Failed to load favorites.');
    }
  };

  const removeFavorite = async (movieId, title) => {
    const confirm = window.confirm(`Are you sure you want to remove "${title}" from favorites?`);
    if (!confirm) return;

    const token = localStorage.getItem('token');
    setLoadingId(movieId);
    try {
      await axios.delete(`/user/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((movie) => movie.movieId !== movieId));
      toast.success(`"${title}" removed from favorites`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove favorite. Try again.');
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
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">❤️ My Favorite Movies</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {favorites.map((movie) => (
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
                <button
                  onClick={() => removeFavorite(movie.movieId, movie.title)}
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

export default Favorites;
