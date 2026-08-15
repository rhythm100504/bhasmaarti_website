import React from "react";

export default function Festivals() {
  return (
    <section id="festivals">
      <div className="section-header-flex">
        <div>
          <div className="section-label">Sacred Calendar</div>
          <h2 className="section-title">Celebrate Every Sacred Occasion with Mahakal</h2>
          <div className="gold-line"></div>
        </div>
        <a href="/calendar" className="see-all" style={{ marginBottom: "1.5rem" }}>
          See all →
        </a>
      </div>

      <div className="festival-grid">
        <div className="festival-card fade-in">
          <div className="festival-hero">
            <div className="festival-hero-bg" style={{ backgroundImage: "url('/Sacred%20Calendar/Mahashivratri.jpg')" }}></div>
          </div>
          <div className="festival-info">
            <h3>Mahashivratri</h3>
            <p>The grand night of Lord Shiva — a night-long vigil of devotion, chanting, and Abhishek at Mahakaleshwar</p>
            <span className="festival-date">February 2026</span>
          </div>
        </div>
        <div className="festival-card fade-in">
          <div className="festival-hero">
            <div className="festival-hero-bg" style={{ backgroundImage: "url('/Sacred%20Calendar/Shravan%20Maas.jpeg')" }}></div>
          </div>
          <div className="festival-info">
            <h3>Shravan Maas</h3>
            <p>The holy month of Shiva — daily special Bhasma Aartis, Kanwar yatras, and temple festivities throughout</p>
            <span className="festival-date">July–August 2025</span>
          </div>
        </div>
        <div className="festival-card fade-in">
          <div className="festival-hero">
            <div className="festival-hero-bg" style={{ backgroundImage: "url('/Sacred%20Calendar/Sawan%20Somvar.jpg')" }}></div>
          </div>
          <div className="festival-info">
            <h3>Sawan Somvar</h3>
            <p>Monday fasts and special Shiva worship during the holy month — a deeply auspicious time at Mahakaleshwar</p>
            <span className="festival-date">Every Monday, Shravan</span>
          </div>
        </div>
        <div className="festival-card fade-in">
          <div className="festival-hero">
            <div className="festival-hero-bg" style={{ backgroundImage: "url('/Sacred%20Calendar/Nag%20Panchami.jpeg')" }}></div>
          </div>
          <div className="festival-info">
            <h3>Nag Panchami</h3>
            <p>The ancient festival of serpent worship — sacred traditions observed with great devotion in Ujjain</p>
            <span className="festival-date">August 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
}
