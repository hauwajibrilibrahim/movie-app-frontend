import { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [resultsPerPage, setResultsPerPage] = useState(6);

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

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: import.meta.env.VITE_TMDB_API_KEY,
          with_genres: selectedGenre || undefined,
          primary_release_year: year || undefined,
          'vote_average.gte': rating || undefined,
          query: query || undefined,
        },
      });
      setMovies(res.data.results);
      setIsLoading(false);
      setCurrentPage(1); // reset to first page after search
    } catch (err) {
      console.error('Failed to fetch movies', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * resultsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - resultsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / resultsPerPage);

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
              placeholder="e.g. 2021"
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
              placeholder="e.g. 7.5"
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
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">🎬 Movie Results</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-3xl text-gray-600" />
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <div className="mb-4 flex justify-end items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Results per page:</label>
                <select
                  value={resultsPerPage}
                  onChange={(e) => {
                    setResultsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border px-2 py-1 rounded-md"
                >
                  {[3, 6, 9, 12].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMovies.map((movie) => (
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

            {/* Pagination Controls */}
            {movies.length > resultsPerPage && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
