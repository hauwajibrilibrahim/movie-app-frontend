import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-indigo-400 tracking-tight">
          🎬 MovieVerse
        </Link>
        <div className="space-x-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-indigo-300">Home</Link>
          <Link to="/login" className="hover:text-indigo-300">Login</Link>
          <Link to="/register" className="hover:text-indigo-300">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
