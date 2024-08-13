"use client";

import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar" style={{ backgroundColor: '#4a90e2' }}>
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <strong>Voting Portal</strong>
        </a>
        <div className="navbar-burger" data-target="navbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarMenu" className="navbar-menu">
        <div className="navbar-end">
          <a href="/login" className="navbar-item button is-light">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
