"use client";

import React, { useState, useEffect } from "react";

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

export default function Archive() {
  const [activeTab, setActiveTab] = useState("Bhasma Aarti");
  const [searchQuery, setSearchQuery] = useState("");
  const [recordings, setRecordings] = useState<AartiItem[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Archive Categories
  const categories = [
    "Bhasma Aarti",
    "Dadyodak Aarti (Bal Bhog)",
    "Bhog Aarti",
    "Sandhya Aarti",
    "Shayan Aarti",
    "Festival Special"
  ];

  useEffect(() => {
    const fetchAartis = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/aartis`);
        const data = await res.json();
        if (data.success && data.aartis) {
          // Filter to only display 'Published' ones on the landing page
          setRecordings(data.aartis.filter((a: AartiItem) => a.status === "Published"));
        }
      } catch (err) {
        console.error("Failed to load aartis from API.", err);
      }
    };
    fetchAartis();
  }, []);

  // Filtering based on active category tab and search query
  const filteredRecordings = recordings.filter(
    (item) =>
      item.category === activeTab &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(item.created_at)
          .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="archive">
      <div className="section-label">Complete Collection</div>
      <h2 className="section-title">Explore the Complete Aarti Archive</h2>
      <div className="gold-line"></div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <div className="category-tabs">
          {categories.map((cat) => (
            <button key={cat} className={`tab ${activeTab === cat ? "active" : ""}`} onClick={() => setActiveTab(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="search-wrap" style={{ maxWidth: "280px", marginBottom: 0 }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search archives…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="carousel-wrap">
        <div className="carousel-label">
          {activeTab} — Recordings
          <a href="/archive" className="see-all">
            See all →
          </a>
        </div>
        <div className="carousel">
          {filteredRecordings.length > 0 ? (
            filteredRecordings.map((recording) => (
              <div
                key={recording.id}
                className="video-thumb"
                onClick={() => setActiveVideoUrl(recording.video_url)}
                style={{ cursor: "pointer" }}
              >
                <div className="thumb-img">
                  <div className="thumb-cover" style={{ backgroundImage: `url('${recording.thumbnail_url || "/bhasma-aarti-preview.png"}')` }}></div>
                  <div className="thumb-play">
                    <svg viewBox="0 0 16 16">
                      <polygon points="4,2 13,8 4,14" />
                    </svg>
                  </div>
                  <span className="thumb-duration">{recording.duration}</span>
                </div>
                <div className="thumb-info">
                  <h4>{recording.title}</h4>
                  <p>
                    {new Date(recording.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Asia/Kolkata"
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", gridColumn: "1 / -1", textAlign: "center", padding: "2rem 0" }}>
              No recordings found matching details in {activeTab}.
            </p>
          )}
        </div>
      </div>

      {/* ── VIDEO PLAYER MODAL ── */}
      {activeVideoUrl && (
        <div
          onClick={() => setActiveVideoUrl(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 8, 4, 0.9)",
            backdropFilter: "blur(10px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "850px",
              background: "#000",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid rgba(212,160,23,0.25)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            }}
          >
            <button
              onClick={() => setActiveVideoUrl(null)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                color: "#fff",
                cursor: "pointer",
                zIndex: 10,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
