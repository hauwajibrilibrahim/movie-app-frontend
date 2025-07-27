import { useEffect, useState } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchGenres = async () => {
    try {
      const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY,
        },
      });
      setGenres(res.data.genres);
    } catch (err) {
      console.error('Failed to fetch genres', err);
    }
  };

  const fetchMovies = async (page = 1, overwrite = false) => {
    try {
      setIsLoading(true);
      const params = {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'en-US',
        page,
      };

      let url = '';
      if (query.trim()) {
        url = 'https://api.themoviedb.org/3/search/movie';
        params.query = query;
      } else {
        url = 'https://api.themoviedb.org/3/discover/movie';
        if (selectedGenre) params.with_genres = selectedGenre;
        if (year) params.primary_release_year = year;
        if (rating) params['vote_average.gte'] = rating;
      }

      const res = await axios.get(url, { params });
      const newMovies = res.data.results;

      if (overwrite || page === 1) {
        setMovies(newMovies);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }

      setCurrentPage(page);
      setHasMore(page < res.data.total_pages);
    } catch (err) {
      console.error('Failed to fetch movies', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Debounced search query input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchMovies(1, true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset movies & refetch when filters change (not query)
  useEffect(() => {
    fetchMovies(1, true);
  }, [selectedGenre, year, rating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMovies(1, true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Search</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded-md"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2021"
              className="mt-1 w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Rating</label>
            <input
              type="number"
              step="0.1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="7.5"
              className="mt-1 w-full border px-3 py-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">🎬 Movies</h1>

        {isLoading && movies.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-3xl text-gray-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <Link to={`/movie/${movie.id}`} key={movie.id}>
                  <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition h-full">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={movie.title}
                      className="w-full h-72 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">{movie.title}</h2>
                      <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{movie.overview}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchMovies(currentPage + 1)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {/* No More Results Message */}
            {!hasMore && movies.length > 0 && (
              <p className="text-center mt-6 text-gray-500">No more results to load.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
