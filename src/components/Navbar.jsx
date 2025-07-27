import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="MovieMuse Logo"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="text-xl font-bold text-white hidden sm:inline">
                MovieMuse
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <div className="relative group">
              <button
                className="flex items-center gap-1 font-medium focus:outline-none"
                aria-haspopup="true"
                aria-expanded="false"
              >
                My Library
                <ChevronDown size={16} className="transition-transform group-hover:rotate-180 duration-300" />
              </button>

              <div className="absolute hidden group-hover:block mt-2 bg-white text-gray-900 rounded-md shadow-md min-w-[150px] z-50">
                <Link
                  to="/favorites"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  ❤️ Favorites
                </Link>
                <Link
                  to="/watchlist"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  📺 Watchlist
                </Link>
              </div>
            </div>

            {!token ? (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                <button onClick={handleLogout} className="hover:text-red-400">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Hamburger for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-4 pb-6 space-y-2">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/favorites" className="block text-white hover:text-gray-300">
            ❤️ Favorites
          </Link>
          <Link to="/watchlist" className="block text-white hover:text-gray-300">
            📺 Watchlist
          </Link>
          {!token ? (
            <>
              <Link to="/login" className="block text-white hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="block text-white hover:text-gray-300">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="block text-white hover:text-gray-300">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
