"use client";


import { API_URL } from "@/config";
import React, { useState, useEffect } from "react";
import Navbar from "@/landing/Navbar";
import Footer from "@/landing/Footer";

interface Recording {
  id: number;
  title: string;
  category: string;
  duration: string;
  video_url: string;
  thumbnail_url: string;
  status: string;
  created_at: string;
}

export default function ArchivePage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // June 2026 calendar helper config
  // June 1, 2026 is a Monday (starts at column 0 in our Mon-Sun grid)
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Aarti Timings General Info Schedule
  const scheduleData = [
    {
      name: "Bhasma Aarti",
      summer: "4:00 AM – 6:00 AM",
      winter: "4:00 AM – 6:00 AM",
      desc: "The most famous ritual using holy ash. Requires Advance Online Booking.",
      duration: "51:42",
      img: "/bhasma-aarti-preview.png"
    },
    {
      name: "Dadyodak Aarti (Bal Bhog)",
      summer: "7:00 AM – 7:45 AM",
      winter: "7:30 AM – 8:15 AM",
      desc: "Morning ritual where fruit and light breakfast offerings are given to the deity.",
      duration: "32:15",
      img: "/aarti-diya-thumb.png"
    },
    {
      name: "Bhog Aarti",
      summer: "10:00 AM – 10:45 AM",
      winter: "10:30 AM – 11:15 AM",
      desc: "Mid-day lunch offering. The inner sanctum briefly closes for darshan.",
      duration: "28:50",
      img: "/library/lingashtakam.jpeg"
    },
    {
      name: "Sandhya Aarti",
      summer: "7:00 PM – 7:45 PM",
      winter: "6:30 PM – 7:15 PM",
      desc: "Evening sunset prayer with heavy lighting of lamps and chants.",
      duration: "48:10",
      img: "/temple-bell-thumb.png"
    },
    {
      name: "Shayan Aarti",
      summer: "10:30 PM – 11:00 PM",
      winter: "10:30 PM – 11:00 PM",
      desc: "Final night ritual where the deity is put to rest before temple closure.",
      duration: "25:30",
      img: "/mahakal-temple.png"
    }
  ];

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/aartis`);
        const data = await res.json();
        if (data.success && data.aartis) {
          // Filter to only display 'Published' ones
          setRecordings(data.aartis.filter((a: Recording) => a.status === "Published"));
        }
      } catch (err) {
        console.error("Failed to load recordings from API.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecordings();
  }, []);

  const getLocalDateString = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return formatter.format(dateObj); // returns YYYY-MM-DD
  };

  const formatGroupHeader = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00+05:30").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    });
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(`2026-06-${String(day).padStart(2, "0")}`);
    setIsCalendarOpen(false);
  };

  const clearSelection = () => {
    setSelectedDate(null);
  };

  // Determine unique dates that have uploaded recordings
  const uniqueRecordingDates = Array.from(
    new Set(recordings.map((rec) => getLocalDateString(rec.created_at)))
  ).sort((a, b) => b.localeCompare(a));

  // Determine what days to render
  const renderedDates = selectedDate
    ? [selectedDate]
    : uniqueRecordingDates;

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
          <div className="section-label">Aarti Archives</div>
          <h1 className="hero-h1" style={{ margin: "0.5rem 0 1rem", fontSize: "2.8rem" }}>
            Shri Mahakaleshwar <em>Aarti Collection</em>
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.75", fontSize: "0.95rem" }}>
            Explore, watch, and search the daily recorded Aarti ceremonies of Ujjain's Jyotirlinga. Use the calendar selector below to choose any specific day, or review the daily ritual timelines.
          </p>
        </div>

        {/* Popover Calendar Container */}
        <div className="calendar-popover-container" style={{ display: "block", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              style={{ gap: "0.75rem", padding: "0.75rem 1.6rem", fontSize: "0.85rem", fontWeight: 600 }}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Pick date from the calendar
            </button>
            {selectedDate && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--accent-gold)", fontWeight: 500 }}>
                  Selected Date: {parseInt(selectedDate.split("-")[2])} June 2026
                </span>
                <button
                  className="see-all"
                  style={{ textTransform: "none", fontSize: "0.8rem", border: "none", background: "none", cursor: "pointer", marginLeft: "0.25rem" }}
                  onClick={clearSelection}
                >
                  (Clear Filter)
                </button>
              </div>
            )}
          </div>

          {isCalendarOpen && (
            <>
              <div className="calendar-popover-backdrop" onClick={() => setIsCalendarOpen(false)}></div>
              <div className="calendar-popover">
                <div className="calendar-header" style={{ marginBottom: "1rem" }}>
                  <span className="calendar-month-year" style={{ fontSize: "1.1rem" }}>June 2026</span>
                  {selectedDate && (
                    <button
                      className="see-all"
                      style={{ textTransform: "none", fontSize: "0.75rem" }}
                      onClick={() => {
                        clearSelection();
                        setIsCalendarOpen(false);
                      }}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="calendar-grid" style={{ gap: "0.4rem" }}>
                  {weekdays.map((wd) => (
                    <div key={wd} className="calendar-weekday" style={{ paddingBottom: "0.4rem", fontSize: "0.7rem" }}>
                      {wd.substring(0, 2)}
                    </div>
                  ))}

                  {calendarDays.map((day) => {
                    const dayStr = `2026-06-${String(day).padStart(2, "0")}`;
                    const isSelected = selectedDate === dayStr;
                    const hasRecordings = recordings.some(
                      (rec) => getLocalDateString(rec.created_at) === dayStr
                    );
                    return (
                      <div
                        key={day}
                        className={`calendar-day ${isSelected ? "selected" : ""}`}
                        style={{
                          fontSize: "0.85rem",
                          position: "relative",
                          border: hasRecordings ? "1px solid rgba(212,160,23,0.4)" : undefined,
                          background: hasRecordings && !isSelected ? "rgba(212,160,23,0.06)" : undefined
                        }}
                        onClick={() => handleDateClick(day)}
                      >
                        {day}
                        {hasRecordings && (
                          <span style={{
                            position: "absolute",
                            bottom: "3px",
                            width: "4px",
                            height: "4px",
                            background: isSelected ? "#fff" : "var(--accent-gold)",
                            borderRadius: "50%"
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Archive Recordings Grid */}
        <div style={{ marginBottom: "4rem" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
              Loading sacred archives...
            </div>
          ) : renderedDates.length > 0 ? (
            renderedDates.map((dayStr) => {
              const dayRecordings = recordings.filter(
                (rec) => getLocalDateString(rec.created_at) === dayStr
              );

              if (dayRecordings.length === 0) {
                if (selectedDate) {
                  return (
                    <div key={dayStr} className="day-group">
                      <div className="day-header">
                        <h3>{formatGroupHeader(dayStr)}</h3>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "1.5rem 0" }}>
                        No recordings uploaded for this date.
                      </p>
                    </div>
                  );
                }
                return null;
              }

              return (
                <div key={dayStr} className="day-group">
                  <div className="day-header">
                    <h3>{formatGroupHeader(dayStr)}</h3>
                    <p>All daily recorded offerings for this day</p>
                  </div>

                  <div className="day-artis-grid">
                    {dayRecordings.map((rec) => (
                      <div
                        key={rec.id}
                        className="video-thumb"
                        style={{ cursor: "pointer" }}
                        onClick={() => setActiveVideoUrl(rec.video_url)}
                      >
                        <div className="thumb-img">
                          <div className="thumb-cover" style={{ backgroundImage: `url('${rec.thumbnail_url || "/bhasma-aarti-preview.png"}')` }}></div>
                          <div className="thumb-play">
                            <svg viewBox="0 0 16 16">
                              <polygon points="4,2 13,8 4,14" />
                            </svg>
                          </div>
                          <span className="thumb-duration">{rec.duration}</span>
                        </div>
                        <div className="thumb-info">
                          <h4 style={{ fontSize: "0.82rem", fontWeight: 600 }}>{rec.title}</h4>
                          <p style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginTop: "0.2rem" }}>
                            {rec.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
              No recordings found in the database.
            </div>
          )}
        </div>

        {/* Summer/Winter Schedule Table (placed at bottom) */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="section-label">Aarti Timings</div>
          <h2 className="section-title" style={{ fontSize: "1.6rem", margin: "0.5rem 0" }}>
            Summer & Winter Schedules
          </h2>
          <div className="gold-line"></div>
        </div>

        <div className="schedule-table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Aarti Name</th>
                <th>Summer Schedule</th>
                <th>Winter Schedule</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((aarti) => (
                <tr key={aarti.name}>
                  <td>
                    <strong>{aarti.name}</strong>
                  </td>
                  <td>
                    <em>{aarti.summer}</em>
                  </td>
                  <td>
                    <em>{aarti.winter}</em>
                  </td>
                  <td>{aarti.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

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
    </>
  );
}
