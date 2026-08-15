"use client";

import React, { useEffect, useState } from "react";

interface AboutStat {
  id: number;
  label: string;
  value: string;
}

interface AboutData {
  eyebrow: string;
  title: string;
  subtitle: string;
  text_1: string;
  text_2: string;
  stats: AboutStat[];
}

const DEFAULT_ABOUT: AboutData = {
  eyebrow: "The Sacred Legend",
  title: "Shri Mahakaleshwar Jyotirlinga",
  subtitle: "One of the Twelve Sacred Jyotirlingas of India",
  text_1: "Located in the ancient city of Ujjain, Shri Mahakaleshwar Jyotirlinga is one of the most powerful manifestations of Lord Shiva on earth — a sacred flame of divine consciousness that has burned continuously since the dawn of cosmic time.",
  text_2: "Known as the only Dakshinamukhi Jyotirlinga — the one that faces south — Mahakaleshwar represents the supreme force of time itself. As Mahakal, Lord Shiva is the master of death and liberation, transcending the boundaries of past, present, and future.",
  stats: [
    { id: 1, label: "Sacred Jyotirlingas", value: "12" },
    { id: 2, label: "Years of History", value: "5000+" },
    { id: 3, label: "Daily Aartis", value: "6" },
    { id: 4, label: "Divine Blessings", value: "∞" }
  ]
};

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/about");
        const data = await res.json();
        if (data.success && data.settings) {
          setAboutData(data.settings);
        }
      } catch (err) {
        console.error("Failed to load about settings from API, using defaults.", err);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <section id="about">
      <div className="about-grid">
        <div>
          <div className="section-label">{aboutData.eyebrow}</div>
          <h2 className="section-title">{aboutData.title}</h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              marginBottom: "1.25rem",
              fontFamily: "var(--font-cinzel), serif",
            }}
          >
            {aboutData.subtitle}
          </p>
          <div className="gold-line"></div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            {aboutData.text_1}
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, fontSize: "0.9rem", marginBottom: "2rem" }}>
            {aboutData.text_2.includes("Dakshinamukhi Jyotirlinga") ? (
              <>
                Known as the only <strong style={{ color: "var(--accent-gold)", fontWeight: 500 }}>Dakshinamukhi Jyotirlinga</strong>
                {aboutData.text_2.split("Dakshinamukhi Jyotirlinga")[1] || ""}
              </>
            ) : (
              aboutData.text_2
            )}
          </p>

          <div className="about-stats">
            {aboutData.stats.map((stat) => (
              <div className="stat-box" key={stat.id}>
                <span className="stat-num">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-visual">
          <div className="about-mandala">
            <div className="mandala-center"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
