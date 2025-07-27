import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import Profile  from './pages/Profile';
import InstallPWA from './components/InstallPWA';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);
  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8"> 
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>
      <div><InstallPWA /></div>
    </Router>
    
  );
}

export default App;
