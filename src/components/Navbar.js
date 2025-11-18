import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar-desktop">
        <div className="logo">CapShala</div>
        <div className="nav-links">
          <Link to="/home">
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </Link>
          <Link to="/favorites">
            <i className="fa-regular fa-heart"></i> Favorites
          </Link>
          <Link to="#">
            <i className="fa-regular fa-user"></i> Profile
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="navbar-mobile">
        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
          <i className="fa-solid fa-house"></i>
        </Link>
        <Link to="#">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Link>
        <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>
          <i className="fa-solid fa-heart"></i>
        </Link>
        <Link to="#">
          <i className="fa-regular fa-user"></i>
        </Link>
      </div>
    </>
  );
};

export default Navbar;

