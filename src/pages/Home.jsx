import { Link } from 'react-router-dom';
import RecommendedMovies from '../components/RecommendedMovies';

function Home({ user }) {
  console.log("User in Home:", user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Discover Your Next Favorite Movie 🎥
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Dive into the world of cinema. Search, rate, and build your custom watchlists.
        </p>
        <Link to="/search">
          <button className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-xl font-semibold shadow-md">
            Get Started
          </button>
        </Link>
      </section>

      {/* Personalized Recommendations */}
      {user && (
        <section className="w-full max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
          </h2>
          <RecommendedMovies token={user.token} />
        </section>
      )}
    </div>
  );
}

export default Home;
