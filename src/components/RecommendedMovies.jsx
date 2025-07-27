import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom';

const RecommendedMovies = () => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && Array.isArray(res.data.recommended)) {
          setRecommended(res.data.recommended);
        } else {
          setRecommended([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error.response?.data || error.message);
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recommended.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommended.map((movie) => (
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
      ) : (
        <p>No recommendations available yet.</p>
      )}
    </div>
  );
};

export default RecommendedMovies;
