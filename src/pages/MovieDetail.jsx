import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      setMovie(res.data);
    };

    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const trailer = res.data.results.find(
          (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        console.error('Error fetching trailer:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/reviews/${id}`);
        setAllReviews(res.data.reviews);
        if (token) {
          const userRes = await axios.get(`http://localhost:5000/api/user/my-review/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserReview(userRes.data.review);
          setReviewText(userRes.data.review?.text || '');
          setRating(userRes.data.review?.rating || 0);
        }
      } catch (err) {
        console.error('Error fetching reviews', err);
      }
    };

    fetchMovie();
    fetchTrailer();
    fetchReviews();
  }, [id]);

  const saveToFavorites = async () => {
    if (!token) return toast.error('Please log in first');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/favorites',
        {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving movie');
    }
  };

  const saveToWatchlist = async () => {
    if (!token) return toast.error('Please log in first');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/watchlist',
        {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving movie');
    }
  };

  const submitReview = async () => {
    if (!token) return toast.error('Login to review');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/review',
        {
          movieId: movie.id,
          movieTitle: movie.title,
          reviewText: reviewText,
          starRating: rating,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setUserReview({ text: reviewText, rating });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/user/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewText('');
      setUserReview(null);
      const updated = await axios.get(`http://localhost:5000/api/user/reviews/${id}`);
      setAllReviews(updated.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  if (!movie) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Toaster />

      <div className="max-w-4xl mx-auto">
        {/* Trailer */}
        {trailerKey && (
          <div className="aspect-video mb-8 rounded overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-1/3 rounded-lg shadow-xl"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-sm text-gray-300 mb-2">
              {movie.release_date} • {movie.runtime} min
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {movie.genres?.map((g) => g.name).join(', ')}
            </p>
            <p className="text-gray-200 mb-4">{movie.overview}</p>
            <p className="text-yellow-400 font-semibold mb-4">
              ⭐ {movie.vote_average} / 10
            </p>

            <div className="flex flex-row gap-3">
              <button
                onClick={saveToFavorites}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-md transition"
              >
                ❤️ Save to Favorites
              </button>

              <button
                onClick={saveToWatchlist}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
              >
                📺 Add to Watchlist
              </button>
            </div>

            {/* Review Form */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Your Review</h3>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="3"
                className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                placeholder="Write your thoughts..."
              ></textarea>

              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {userReview ? (
                <div className="flex gap-3">
                  <button
                    onClick={submitReview}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                  >
                    Update Review
                  </button>
                  <button
                    onClick={() => handleDelete(userReview._id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                  >
                    Delete Review
                  </button>
                </div>
              ) : (
                <button
                  onClick={submitReview}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                >
                  Submit Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Display */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">All Reviews</h3>
          {allReviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {allReviews.map((rev, idx) => (
                <div key={idx} className="bg-gray-800 p-4 rounded-md shadow-md text-sm">
                  <p className="font-semibold text-yellow-300">
                    {rev.username || 'Anonymous'}{' '}
                    <span className="text-xs text-gray-400">({rev.rating}★)</span>
                  </p>
                  <p className="text-gray-300">{rev.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
