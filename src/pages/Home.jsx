import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Discover Your Next Favorite Movie 🎥
        </h1>
        <p className="text-gray-300 text-lg mb-6">
          Dive into the world of cinema. Search, rate, and build your custom watchlists.
        </p>
        <Link to="/register">
          <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-3 rounded-lg font-semibold">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
