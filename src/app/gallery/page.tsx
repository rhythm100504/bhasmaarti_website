"use client";

import React from "react";
import Navbar from "@/landing/Navbar";
import Footer from "@/landing/Footer";

interface GalleryItem {
  title: string;
  image: string;
  date: string;
  description: string;
}

export default function GalleryPage() {
  const galleryItems: GalleryItem[] = [
    {
      title: "Bhasma Aarti Flames",
      image: "/Sacred Moments/Bhasma Aarti Flames.png",
      date: "15 June 2026",
      description: "The sacred fire and holy ash (Bhasma) represent the eternal truth of life and dissolution. The dramatic flames dance during the early morning Bhasma Aarti, illuminating the inner sanctum. This moment is captured to signify the transition of creation, highlighting Shiva as the master of time and mortality."
    },
    {
      title: "Temple Bells at Brahma Muhurta",
      image: "/Sacred Moments/Temple Bells at Brahma Muhurta.webp",
      date: "14 June 2026",
      description: "Ringing at 3:30 AM, these ancient bronze bells echo through the temple corridors to awaken the deities and announce the commencement of the Bhasma Aarti. The vibration of the bells is believed to purify the surroundings and center the minds of devotees entering the sacred premises."
    },
    {
      title: "Sacred Abhishek Ritual",
      image: "/Sacred Moments/Sacred Abhishek Ritual.jpg",
      date: "13 June 2026",
      description: "Devotees and priests pour holy water, milk, honey, and Panchamrit over the sacred Jyotirlinga. The abhishek symbolizes the cooling of Lord Shiva's intense energy and the constant flow of devotion, bringing peace, healing, and spiritual purification to all who witness it."
    },
    {
      title: "Mahakaleshwar Shikhara at Dawn",
      image: "/Sacred Moments/Mahakaleshwar Shikhara at Dawn.jpg",
      date: "12 June 2026",
      description: "Captured during Brahma Muhurta, the first light of dawn illuminates the golden Shikhara (spire) of the temple. This moment represents the awakening of the cosmos under the protective gaze of Lord Mahakal, marking the beginning of the daily sacred abhishek and Bhasma Aarti rituals."
    },
    {
      title: "Full Moon over Ujjain",
      image: "/Sacred Moments/Full Moon over Ujjain.jpeg",
      date: "11 June 2026",
      description: "The spectacular sight of the full moon shining directly above the Mahakaleshwar temple spire. In Hindu cosmology, Lord Shiva wears the crescent moon (Chandrashekhara) on his matted locks. A full moon night over the temple is a rare moment of cosmic alignment and spiritual radiance."
    },
    {
      title: "Floral Offerings",
      image: "/Sacred Moments/Floral Offerings.jpg",
      date: "10 June 2026",
      description: "A stunning close-up of fresh bilva leaves, marigolds, and sacred flowers arranged atop the Jyotirlinga during the mid-day Bhog Aarti. Flowers symbolize the fleeting nature of life and are offered as a symbol of surrender, love, and devotion to the Lord."
    },
    {
      title: "Trishula at the Main Gate",
      image: "/Sacred Moments/Trishula at the Main Gate.jpg",
      date: "09 June 2026",
      description: "The mighty Trishula (trident) standing guard at the main entrance gate of the temple complex. The three prongs of the trident represent the three gunas (Sattva, Rajas, Tamas), the three worlds, and Shiva's absolute control over creation, preservation, and dissolution."
    },
    {
      title: "Rudraksha & Sacred Beads",
      image: "/Sacred Moments/Rudraksha & Sacred Beads.jpeg",
      date: "08 June 2026",
      description: "A collection of sacred Rudraksha beads draped over a silver vessel. Legend says Rudraksha beads are formed from the tears of Lord Shiva as he woke from deep meditation. They serve as a constant channel for prayer, meditation, and connection to the divine."
    },
    {
      title: "Evening Aarti Glow",
      image: "/Sacred Moments/evening glow.jpeg",
      date: "14 June 2026",
      description: "The warm, celestial glow of thousands of oil lamps (diyas) reflecting off the marble floors during the Sandhya Aarti. As dusk falls, the temple is filled with chants and the soft light of devotion, symbolizing the illumination of the soul and the dispelling of darkness."
    }
  ];

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
        <div className="section-label">Sacred Moments</div>
        <h1 className="hero-h1" style={{ margin: "0.5rem 0 1rem", fontSize: "2.8rem" }}>
          Divine Moments of <em>Shri Mahakaleshwar</em>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.75", fontSize: "0.95rem" }}>
          A visual journey capturing the eternal spirit of Ujjain's Jyotirlinga. Each photograph documents a specific holy instant, detailing the cosmic alignments, ancient rituals, and devotional items that make up the daily worship of Lord Shiva.
        </p>
      </div>

      {/* Detailed Gallery Grid */}
      <div className="gallery-detail-grid">
        {galleryItems.map((item, index) => (
          <div key={index} className="gallery-detail-card">
            <div className="gallery-detail-img-wrapper">
              <div 
                className="gallery-detail-img" 
                style={{ backgroundImage: `url('${item.image}')` }}
              ></div>
              <span className="gallery-detail-date">{item.date}</span>
            </div>
            <div className="gallery-detail-info">
              <h3 className="gallery-detail-title">{item.title}</h3>
              <p className="gallery-detail-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
      <Footer />
    </>
  );
}
