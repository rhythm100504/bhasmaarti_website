import React, { useState, useEffect } from "react";

interface OccasionItem {
  id: number;
  title: string;
  description: string;
  date: string;
  image_url: string;
  status: string;
}

export default function Festivals() {
  const [items, setItems] = useState<OccasionItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/calendar`);
        const data = await res.json();
        if (data.success && data.items) {
          const published = data.items
            .filter((item: any) => item.status === "Published")
            .slice(0, 4); // Show top 4
          setItems(published);
        }
      } catch (err) {
        console.error("Failed to load calendar occasions", err);
      }
    };
    fetchItems();
  }, []);

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
        {items.length > 0 ? (
          items.map((item) => (
            <div className="festival-card fade-in" key={item.id} onClick={() => window.location.href = "/calendar"} style={{ cursor: "pointer" }}>
              <div className="festival-hero">
                <div 
                  className="festival-hero-bg" 
                  style={{ backgroundImage: `url('${item.image_url || "/Sacred Calendar/Mahashivratri.jpg"}')` }}
                ></div>
              </div>
              <div className="festival-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="festival-date">{item.date}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "var(--text-secondary)", fontStyle: "italic", padding: "2rem" }}>
            Loading calendar occasions...
          </div>
        )}
      </div>
    </section>
  );
}
