"use client";

import React, { useEffect, useState } from "react";

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  status: string;
}

interface TrustData {
  eyebrow: string;
  title: string;
}

const DEFAULT_SETTINGS: TrustData = {
  eyebrow: "Why BhasmaArti.com",
  title: "Sacred. Authentic. Devotional."
};

const DEFAULT_FEATURES: FeatureCard[] = [
  {
    id: 1,
    title: "Daily Updated Archive",
    description: "Fresh Bhasma Aarti recordings added regularly to our growing collection",
    image_url: "/aarti-diya-thumb.png",
    status: "Active"
  },
  {
    id: 2,
    title: "Temple Information",
    description: "Accurate, curated details about Mahakaleshwar Jyotirlinga and its sacred history",
    image_url: "/temple-bell-thumb.png",
    status: "Active"
  },
  {
    id: 3,
    title: "Festival Coverage",
    description: "Immersive coverage of Mahashivratri, Shravan Maas, and other sacred occasions",
    image_url: "/bhasma-aarti-preview.png",
    status: "Active"
  },
  {
    id: 4,
    title: "Devotional Library",
    description: "Stotras, mantras, bhajans, and sacred texts in one curated spiritual resource",
    image_url: "/temple-bell-thumb.png",
    status: "Active"
  },
  {
    id: 5,
    title: "Mobile Optimized",
    description: "Seamless devotional experience across all your devices, anytime",
    image_url: "/aarti-diya-thumb.png",
    status: "Active"
  },
  {
    id: 6,
    title: "Live Streaming Ready",
    description: "Infrastructure in place for future live Bhasma Aarti streaming experiences",
    image_url: "/bhasma-aarti-preview.png",
    status: "Active"
  }
];

const getFallbackIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("archive") || t.includes("daily")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        <circle cx="8" cy="12" r="2" fill="var(--accent-saffron)" />
      </svg>
    );
  }
  if (t.includes("temple") || t.includes("information")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M12 2v22" />
        <path d="M6 10h12" />
        <path d="M4 15h16" />
        <path d="M9 22v-4h6v4" />
        <circle cx="12" cy="7" r="1.5" fill="var(--accent-saffron)" />
      </svg>
    );
  }
  if (t.includes("festival") || t.includes("coverage")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13c0 5 4 8 10 8s10-3 10-8H2z" />
        <path d="M12 3c1.5 2 3.5 5 0 9-3.5-4-1.5-7 0-9z" fill="var(--accent-saffron)" stroke="var(--accent-saffron)" />
        <path d="M2 13c2.5-3 5.5-3 8 0" />
        <path d="M14 13c2.5-3 5.5-3 8 0" />
      </svg>
    );
  }
  if (t.includes("library") || t.includes("devotional")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="6" x2="16" y2="6" stroke="var(--accent-saffron)" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    );
  }
  if (t.includes("mobile") || t.includes("optimized")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" stroke="var(--accent-saffron)" />
        <line x1="10" y1="22" x2="14" y2="22" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3a13 13 0 0 1 14 0" />
      <path d="M8.5 7.5a7 7 0 0 1 7 0" />
      <circle cx="12" cy="13" r="2" fill="var(--accent-saffron)" />
      <path d="M12 15v7" />
      <path d="M8 22h8" />
    </svg>
  );
};

export default function Trust() {
  const [settings, setSettings] = useState<TrustData>(DEFAULT_SETTINGS);
  const [features, setFeatures] = useState<FeatureCard[]>(DEFAULT_FEATURES);

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/trust");
        const data = await res.json();
        if (data.success) {
          if (data.settings) setSettings(data.settings);
          if (data.features) setFeatures(data.features);
        }
      } catch (err) {
        console.error("Failed to load trust settings from API.", err);
      }
    };
    fetchTrustData();
  }, []);

  const activeFeatures = features.filter((f) => f.status === "Active");

  return (
    <section id="trust">
      <div className="center">
        <div className="section-label">{settings.eyebrow}</div>
        <h2 className="section-title">{settings.title}</h2>
        <div className="gold-line"></div>
      </div>
      <div className="trust-grid">
        {activeFeatures.map((feature) => (
          <div className="trust-card fade-in" key={feature.id}>
            <div className="trust-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {feature.image_url ? (
                <img
                  src={feature.image_url}
                  alt={feature.title}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid var(--accent-gold)",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
                  }}
                />
              ) : (
                getFallbackIcon(feature.title)
              )}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
