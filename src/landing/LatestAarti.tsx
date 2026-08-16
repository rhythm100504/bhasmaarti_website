"use client";


import { API_URL } from "@/config";
import React, { useState, useEffect, useRef } from "react";

interface AartiItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  status: string;
  created_at: string;
}

export default function LatestAarti() {
  const [recordings, setRecordings] = useState<AartiItem[]>([]);
  const [selectedAarti, setSelectedAarti] = useState<AartiItem | null>(null);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchAartis = async () => {
      try {
        const res = await fetch(`${API_URL}/api/aartis`);
        const data = await res.json();
        if (data.success && data.aartis) {
          const published = data.aartis.filter((a: AartiItem) => a.status === "Published");
          setRecordings(published);
          if (published.length > 0) {
            setSelectedAarti(published[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest aartis", err);
      }
    };
    fetchAartis();
  }, []);

  // Filter out the currently selected featured video from the grid to avoid duplicates
  const gridItems = selectedAarti 
    ? recordings.filter((r) => r.id !== selectedAarti.id).slice(0, 4)
    : recordings.slice(1, 5);

  return (
    <section id="aarti">
      <div className="section-label">Bhasma Aarti</div>
      <h2 className="section-title">Watch the Latest Bhasma Aarti</h2>
      <div className="gold-line"></div>
      <p className="section-sub" style={{ marginBottom: "2.5rem" }}>
        The Bhasma Aarti of Shri Mahakaleshwar Jyotirlinga is among the most revered rituals in Hinduism. Performed during
        the sacred Brahma Muhurta, this extraordinary ceremony symbolizes devotion, spirituality, and the eternal presence of
        Lord Shiva.
      </p>

      {selectedAarti ? (
        <>
          {/* Featured Video Container */}
          <div 
            className="featured-video animate-pulse-border" 
            style={{ position: "relative", overflow: "hidden" }}
          >
            {isPlayingInline ? (
              <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, background: "#000" }}>
                <video
                  ref={videoRef}
                  src={selectedAarti.video_url}
                  controls
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    borderRadius: "inherit"
                  }}
                />
              </div>
            ) : (
              <div 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  position: "absolute", 
                  top: 0, 
                  left: 0, 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
                onClick={() => setIsPlayingInline(true)}
              >
                <div className="video-cover" style={{ backgroundImage: `url('${selectedAarti.thumbnail_url || "/bhasma-aarti-preview.png"}')` }}></div>
                <div className="video-shade"></div>
                <div className="video-badge-latest">
                  <span className="badge-dot"></span>
                  LATEST RECORDING
                </div>
                <div className="play-btn">
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                </div>
                <div className="video-meta">
                  <div>
                    <div className="video-label">{selectedAarti.title}</div>
                    <div className="video-date">
                      {new Date(selectedAarti.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })} • {selectedAarti.category}
                    </div>
                  </div>
                  <div className="video-live">{selectedAarti.duration}</div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Grid */}
          {gridItems.length > 0 && (
            <div className="video-grid" style={{ marginTop: "2rem" }}>
              {gridItems.map((item) => (
                <div
                  key={item.id}
                  className="video-thumb"
                  onClick={() => {
                    setSelectedAarti(item);
                    setIsPlayingInline(true); // Auto-play the selected item inline in the main container
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="thumb-img">
                    <div className="thumb-cover" style={{ backgroundImage: `url('${item.thumbnail_url || "/bhasma-aarti-preview.png"}')` }}></div>
                    <div className="thumb-play">
                      <svg viewBox="0 0 16 16">
                        <polygon points="4,2 13,8 4,14" />
                      </svg>
                    </div>
                    <span className="thumb-duration">{item.duration}</span>
                  </div>
                  <div className="thumb-info">
                    <h4>{item.title}</h4>
                    <p>
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })} • {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "rgba(255,255,255,0.01)",
          border: "1px dashed rgba(212,160,23,0.15)",
          borderRadius: "8px",
          color: "var(--text-secondary)"
        }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            No recordings uploaded yet. Check back soon for the latest sacred Bhasma Aarti videos!
          </p>
        </div>
      )}
    </section>
  );
}
