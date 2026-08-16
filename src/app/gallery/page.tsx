"use client";


import { API_URL } from "@/config";
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
  const [galleryItems, setGalleryItems] = React.useState<GalleryItem[]>([]);

  React.useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        const data = await res.json();
        if (data.success && data.items) {
          const published = data.items.filter((item: any) => item.status === "Published").map((item: any) => ({
            title: item.title,
            image: item.image_url || "/Sacred Moments/evening glow.jpeg",
            date: item.date,
            description: item.description || ""
          }));
          setGalleryItems(published);
        }
      } catch (err) {
        console.error("Failed to load gallery items", err);
      }
    };
    fetchGallery();
  }, []);

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
