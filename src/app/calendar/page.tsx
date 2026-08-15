"use client";

import React, { useState } from "react";
import Navbar from "@/landing/Navbar";
import Footer from "@/landing/Footer";

interface Aarti {
  name: string;
  time: string;
  duration: string;
  thumb: string;
}

interface Occasion {
  title: string;
  description?: string;
  date: string;
  image: string;
  shringarInfo: string;
  aartis: Aarti[];
}

export default function CalendarPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [activeAarti, setActiveAarti] = useState<Aarti | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const occasions: Occasion[] = [
    {
      title: "Mahashivratri",
      date: "15 February 2026",
      image: "/Sacred Calendar/Mahashivratri.jpg",
      shringarInfo: "On the grand night of Mahashivratri, Lord Mahakaleshwar is adorned with the Maha-Shringar — a magnificent crown crafted from gold, diamonds, and precious gems. The entire inner sanctum is decorated with tonnes of fresh exotic flowers. Devotees queue throughout the night to witness this celestial bridegroom form of Shiva.",
      aartis: [
        { name: "Bhasma Aarti", time: "4:00 AM – 6:00 AM", duration: "56:12", thumb: "/bhasma-aarti-preview.png" },
        { name: "Dadyodak Aarti", time: "7:30 AM – 8:15 AM", duration: "32:45", thumb: "/aarti-diya-thumb.png" },
        { name: "Bhog Aarti", time: "10:30 AM – 11:15 AM", duration: "28:10", thumb: "/library/lingashtakam.jpeg" },
        { name: "Sandhya Aarti", time: "6:30 PM – 7:15 PM", duration: "49:30", thumb: "/temple-bell-thumb.png" },
        { name: "Shayan Aarti", time: "10:30 PM – 11:00 PM", duration: "31:15", thumb: "/mahakal-temple.png" }
      ]
    },
    {
      title: "Shravan Maas",
      date: "05 August 2025",
      image: "/Sacred Calendar/Shravan Maas.jpeg",
      shringarInfo: "During the holy month of Shravan, the Jyotirlinga is decorated daily in distinct divine forms. This specific Shringar captures the deity adorned with a massive silver serpent (Sheshnag) wrapping around the Lingam, surrounded by green Bilva leaves, representing protective power and cosmic wisdom.",
      aartis: [
        { name: "Bhasma Aarti", time: "4:00 AM – 6:00 AM", duration: "52:40", thumb: "/bhasma-aarti-preview.png" },
        { name: "Dadyodak Aarti", time: "7:00 AM – 7:45 AM", duration: "35:12", thumb: "/aarti-diya-thumb.png" },
        { name: "Bhog Aarti", time: "10:00 AM – 10:45 AM", duration: "30:05", thumb: "/library/lingashtakam.jpeg" },
        { name: "Sandhya Aarti", time: "7:00 PM – 7:45 PM", duration: "44:22", thumb: "/temple-bell-thumb.png" },
        { name: "Shayan Aarti", time: "10:30 PM – 11:00 PM", duration: "26:50", thumb: "/mahakal-temple.png" }
      ]
    },
    {
      title: "Sawan Somvar",
      date: "11 August 2025",
      image: "/Sacred Calendar/Sawan Somvar.jpg",
      shringarInfo: "On the Mondays of Shravan, a grand procession (Sawan Somvar Sawari) is held through Ujjain. The Shringar Darshan inside the sanctum depicts Lord Shiva in the 'Chandramouleshwar' form riding the holy bull Nandi, draped with fresh flower garlands and sandalwood paste offerings.",
      aartis: [
        { name: "Bhasma Aarti", time: "4:00 AM – 6:00 AM", duration: "54:15", thumb: "/bhasma-aarti-preview.png" },
        { name: "Dadyodak Aarti", time: "7:00 AM – 7:45 AM", duration: "31:40", thumb: "/aarti-diya-thumb.png" },
        { name: "Bhog Aarti", time: "10:00 AM – 10:45 AM", duration: "29:50", thumb: "/library/lingashtakam.jpeg" },
        { name: "Sandhya Aarti", time: "7:00 PM – 7:45 PM", duration: "48:05", thumb: "/temple-bell-thumb.png" },
        { name: "Shayan Aarti", time: "10:30 PM – 11:00 PM", duration: "27:10", thumb: "/mahakal-temple.png" }
      ]
    },
    {
      title: "Nag Panchami",
      date: "29 August 2025",
      image: "/Sacred Calendar/Nag Panchami.jpeg",
      shringarInfo: "The only day of the year when the shrine of Lord Nagchandreshwar on the third floor of the temple complex opens for public Darshan. The Jyotirlinga below is adorned with a unique Nag-Shringar, celebrating the divine union of Shiva, Parvati, and the serpent king.",
      aartis: [
        { name: "Bhasma Aarti", time: "4:00 AM – 6:00 AM", duration: "58:02", thumb: "/bhasma-aarti-preview.png" },
        { name: "Dadyodak Aarti", time: "7:30 AM – 8:15 AM", duration: "33:15", thumb: "/aarti-diya-thumb.png" },
        { name: "Bhog Aarti", time: "10:30 AM – 11:15 AM", duration: "27:40", thumb: "/library/lingashtakam.jpeg" },
        { name: "Sandhya Aarti", time: "6:30 PM – 7:15 PM", duration: "51:12", thumb: "/temple-bell-thumb.png" },
        { name: "Shayan Aarti", time: "10:30 PM – 11:00 PM", duration: "28:40", thumb: "/mahakal-temple.png" }
      ]
    }
  ];

  const handleOccasionClick = (occ: Occasion) => {
    setSelectedOccasion(occ);
    setActiveAarti(null);
    setIsPlaying(false);
  };

  const handleAartiSelect = (aarti: Aarti) => {
    setActiveAarti(aarti);
    setIsPlaying(true);
  };

  return (
    <>
      <Navbar />
      <div className="archive-container">
        {/* Back to Home Header */}
        <a href="/" className="archive-back-btn">
          ← Return to Home
        </a>

      {/* Main Wording */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label">Sacred Calendar</div>
        <h1 className="hero-h1" style={{ margin: "0.5rem 0 1rem", fontSize: "2.8rem" }}>
          Shringar & Occasions <em>Archive</em>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.75", fontSize: "0.95rem" }}>
          Celebrate and explore the rich archive of special Shringar Darshans and celebrations during auspicious occasions. Choose any historic day to view decoration details and watch the 5 recorded daily Aartis.
        </p>
      </div>

      {/* Grid of Occasions */}
      <div className="festival-grid" style={{ marginTop: "1rem" }}>
        {occasions.map((occ, index) => (
          <div
            key={index}
            className="festival-card"
            style={{ cursor: "pointer" }}
            onClick={() => handleOccasionClick(occ)}
          >
            <div className="festival-hero">
              <div className="festival-hero-bg" style={{ backgroundImage: `url('${occ.image}')` }}></div>
            </div>
            <div className="festival-info">
              <h3>{occ.title}</h3>
              <p>{occ.description || occ.shringarInfo.substring(0, 120) + "..."}</p>
              <span className="festival-date">{occ.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Split Layout Modal */}
      {selectedOccasion && (
        <div className="library-modal-backdrop" onClick={() => setSelectedOccasion(null)}>
          <div 
            className="library-modal" 
            style={{ maxWidth: "1000px", width: "95%" }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="library-modal-header">
              <div className="library-modal-title-wrap">
                <h3>{selectedOccasion.title}</h3>
                <p>Special Occasion • {selectedOccasion.date}</p>
              </div>
              <button className="library-modal-close-btn" onClick={() => setSelectedOccasion(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="library-modal-content">
              <div className="calendar-detail-layout">
                {/* Left Side: Occasion Details and Shringar Image/Player */}
                <div className="calendar-detail-left">
                  <div className="calendar-video-player">
                    {activeAarti && isPlaying ? (
                      <>
                        {/* Video Player Mock */}
                        <div 
                          className="calendar-video-cover" 
                          style={{ backgroundImage: `url('${activeAarti.thumb}')` }}
                        ></div>
                        
                        {/* Video Playing Overlay Details */}
                        <div className="calendar-video-controls">
                          <span style={{ color: "var(--accent-gold)", fontSize: "0.8rem", fontWeight: 600 }}>
                            NOW STREAMING: {activeAarti.name} ({selectedOccasion.date})
                          </span>
                          <div className="player-progress-area">
                            <div className="player-progress-bar-container">
                              <div className="player-progress-bar-fill" style={{ width: "38%" }}></div>
                            </div>
                            <div className="player-time-display" style={{ padding: 0 }}>
                              <span>12:45</span>
                              <span>{activeAarti.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Pause Button */}
                        <button className="calendar-video-play-btn" onClick={() => setIsPlaying(false)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ width: "16px", height: "16px" }}>
                            <rect x="3" y="3" width="6" height="18" rx="1.5" fill="#fff" />
                            <rect x="15" y="3" width="6" height="18" rx="1.5" fill="#fff" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Occasion Image */}
                        <div 
                          className="calendar-video-cover" 
                          style={{ backgroundImage: `url('${selectedOccasion.image}')` }}
                        ></div>
                        {activeAarti && (
                          <button className="calendar-video-play-btn" onClick={() => setIsPlaying(true)}>
                            <svg viewBox="0 0 16 16">
                              <polygon points="4,2 13,8 4,14" fill="#fff" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div>
                    <h4 style={{ color: "var(--accent-gold)", marginBottom: "0.5rem", fontSize: "1rem" }}>
                      {activeAarti ? `Watching: ${activeAarti.name}` : "Divine Shringar Darshan Details"}
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      {selectedOccasion.shringarInfo}
                    </p>
                  </div>
                </div>

                {/* Right Side: Aartis List */}
                <div className="calendar-detail-right">
                  <h4 className="calendar-aartis-header">Daily Recorded Aartis</h4>
                  <div className="calendar-aartis-list">
                    {selectedOccasion.aartis.map((aarti, idx) => {
                      const isActive = activeAarti?.name === aarti.name;
                      return (
                        <div
                          key={idx}
                          className={`calendar-aarti-item ${isActive ? "active" : ""}`}
                          onClick={() => handleAartiSelect(aarti)}
                        >
                          <div
                            className="calendar-aarti-thumb"
                            style={{ backgroundImage: `url('${aarti.thumb}')` }}
                          ></div>
                          <div className="calendar-aarti-info">
                            <h4>{aarti.name}</h4>
                            <p>{aarti.time}</p>
                          </div>
                          <button className="calendar-aarti-watch-btn">
                            {isActive && isPlaying ? "Playing" : "Watch"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
