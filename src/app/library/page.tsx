"use client";


import { API_URL } from "@/config";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/landing/Navbar";
import Footer from "@/landing/Footer";

interface Resource {
  title: string;
  description: string;
  category: string;
  image: string;
  lyrics: string;
  translation: string;
  duration: string;
  audio_url?: string;
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"lyrics" | "meaning">("lyrics");
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = ["All", "Stotrams", "Mantras", "Chalisa & Hymns", "Bhajans"];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`${API_URL}/api/library`);
        const data = await res.json();
        if (data.success && data.items) {
          const published = data.items.filter((item: any) => item.status === "Published").map((item: any) => ({
            title: item.title,
            description: item.description || "",
            category: item.category,
            image: item.thumbnail_url || "/rudrashtakam.jpeg",
            lyrics: item.lyrics || "",
            translation: item.translation || "",
            duration: item.duration,
            audio_url: item.audio_url
          }));
          setResources(published);
        }
      } catch (err) {
        console.error("Failed to load library resources", err);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Playback failed", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedResource]);

  const handleResourceClick = (res: Resource) => {
    setSelectedResource(res);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("00:00");
    setActiveModalTab("lyrics");
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      const pct = (cur / dur) * 100;
      setProgress(pct);

      const minutes = Math.floor(cur / 60);
      const seconds = Math.floor(cur % 60);
      setCurrentTime(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
  };

  // Filter resources based on category and search query
  const filteredResources = resources.filter((res) => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <div className="section-label">Spiritual Resources</div>
        <h1 className="hero-h1" style={{ margin: "0.5rem 0 1rem", fontSize: "2.8rem" }}>
          Shri Mahakaleshwar <em>Devotional Library</em>
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.75", fontSize: "0.95rem" }}>
          Explore, read, search, and listen to the sacred hymns, stotrams, mantras, and bhajans of Lord Shiva. Select any resource to view its Sanskrit lyrics, English translations, and stream audio.
        </p>
      </div>

      {/* Search and Category Tabs container */}
      <div className="library-search-container">
        <div className="library-search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="library-search-input"
            type="text"
            placeholder="Search resources by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="library-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`library-category-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="library-grid" style={{ marginTop: "1rem" }}>
        {filteredResources.length > 0 ? (
          filteredResources.map((res, index) => (
            <div
              key={index}
              className="library-card"
              onClick={() => handleResourceClick(res)}
            >
              <div
                className="library-icon"
                style={{ backgroundImage: `url('${res.image}')` }}
              ></div>
              <div className="library-info">
                <h4>{res.title}</h4>
                <p>{res.description}</p>
              </div>
              <div className="library-play">
                <svg viewBox="0 0 16 16">
                  <polygon points="4,2 13,8 4,14" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "var(--text-secondary)", gridColumn: "1 / -1", textAlign: "center", padding: "4rem 0", fontSize: "0.9rem" }}>
            No spiritual resources found matching your search.
          </p>
        )}
      </div>

      {/* Detail Lyrics & Simulated Player Modal */}
      {selectedResource && (
        <div className="library-modal-backdrop" onClick={() => setSelectedResource(null)}>
          <div className="library-modal" onClick={(e) => e.stopPropagation()}>
            <div className="library-modal-header">
              <div
                className="library-modal-icon"
                style={{ backgroundImage: `url('${selectedResource.image}')` }}
              ></div>
              <div className="library-modal-title-wrap">
                <h3>{selectedResource.title}</h3>
                <p>{selectedResource.category} • {selectedResource.duration}</p>
              </div>
              <button className="library-modal-close-btn" onClick={() => setSelectedResource(null)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="library-modal-content">
              <div className="library-modal-tab-bar">
                <button
                  className={`library-modal-tab ${activeModalTab === "lyrics" ? "active" : ""}`}
                  onClick={() => setActiveModalTab("lyrics")}
                >
                  Sanskrit Lyrics
                </button>
                <button
                  className={`library-modal-tab ${activeModalTab === "meaning" ? "active" : ""}`}
                  onClick={() => setActiveModalTab("meaning")}
                >
                  English Meaning
                </button>
              </div>

              <div style={{ flexGrow: 1, minHeight: "200px" }}>
                {activeModalTab === "lyrics" ? (
                  <div className="lyrics-text-container">
                    {selectedResource.lyrics}
                  </div>
                ) : (
                  <div className="translation-text-container">
                    {selectedResource.translation}
                  </div>
                )}
              </div>

              {/* Actual Audio Player */}
              <div className="library-audio-player">
                {selectedResource.audio_url && (
                  <audio
                    ref={audioRef}
                    src={selectedResource.audio_url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                      setIsPlaying(false);
                      setProgress(0);
                      setCurrentTime("00:00");
                    }}
                  />
                )}
                <button className="player-play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" style={{ width: "12px", height: "12px", display: "block", margin: "auto" }}>
                      <rect x="3" y="3" width="4" height="18" rx="1" fill="#fff" />
                      <rect x="13" y="3" width="4" height="18" rx="1" fill="#fff" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" style={{ width: "12px", height: "12px", display: "block", margin: "auto" }}>
                      <polygon points="4,2 13,8 4,14" fill="#fff" />
                    </svg>
                  )}
                </button>

                <div className="player-progress-area">
                  <div className="player-progress-bar-container" style={{ cursor: "pointer" }} onClick={(e) => {
                    if (audioRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const width = rect.width;
                      const percentage = clickX / width;
                      audioRef.current.currentTime = percentage * audioRef.current.duration;
                    }
                  }}>
                    <div className="player-progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="player-time-display">
                    <span>{currentTime}</span>
                    <span>{selectedResource.duration}</span>
                  </div>
                </div>

                <div className="player-volume-control">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-secondary)" }}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <div className="player-volume-slider" style={{ cursor: "pointer" }} onClick={(e) => {
                    if (audioRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const width = rect.width;
                      audioRef.current.volume = Math.max(0, Math.min(1, clickX / width));
                    }
                  }}>
                    <div className="player-volume-fill" style={{ width: audioRef.current ? `${audioRef.current.volume * 100}%` : "100%" }}></div>
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
