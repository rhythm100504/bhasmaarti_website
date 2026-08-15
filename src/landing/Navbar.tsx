"use client";

import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Nav scroll border-color effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`} style={{ flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" className="nav-logo">
          Bhasma<span>Arti</span>.com
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#aarti">Bhasma Aarti</a>
          </li>
          <li>
            <a href="/archive">Archive</a>
          </li>
          <li>
            <a href="/#about">Mahakaleshwar</a>
          </li>
          <li>
            <a href="/library">Library</a>
          </li>
          <li>
            <a href="/calendar">Calendar</a>
          </li>
          <li>
            <a href="/gallery">Gallery</a>
          </li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/#aarti" className="nav-cta">
            Watch Aarti
          </a>
          <button 
            className={`nav-mobile-trigger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </button>
        </div>
      </div>
      {menuOpen && (
        <ul className="nav-mobile-links">
          <li>
            <a href="/#aarti" onClick={() => setMenuOpen(false)}>Bhasma Aarti</a>
          </li>
          <li>
            <a href="/archive" onClick={() => setMenuOpen(false)}>Archive</a>
          </li>
          <li>
            <a href="/#about" onClick={() => setMenuOpen(false)}>Mahakaleshwar</a>
          </li>
          <li>
            <a href="/library" onClick={() => setMenuOpen(false)}>Library</a>
          </li>
          <li>
            <a href="/calendar" onClick={() => setMenuOpen(false)}>Calendar</a>
          </li>
          <li>
            <a href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          </li>
        </ul>
      )}
    </nav>
  );
}
