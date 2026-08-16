import { API_URL } from "@/config";
import React, { useState, useEffect } from "react";

interface LibraryItem {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  status: string;
}

export default function Library() {
  const [items, setItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_URL}/api/library`);
        const data = await res.json();
        if (data.success && data.items) {
          const published = data.items
            .filter((item: any) => item.status === "Published")
            .slice(0, 8); // Only show top 8
          setItems(published);
        }
      } catch (err) {
        console.error("Failed to load library items", err);
      }
    };
    fetchItems();
  }, []);

  return (
    <section id="library">
      <div className="section-header-flex">
        <div>
          <div className="section-label">Spiritual Resources</div>
          <h2 className="section-title">Strengthen Your Spiritual Journey</h2>
          <div className="gold-line"></div>
        </div>
        <a href="/library" className="see-all" style={{ marginBottom: "1.5rem" }}>
          See all →
        </a>
      </div>

      <div className="library-grid">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="library-card fade-in" key={item.id} onClick={() => window.location.href = "/library"}>
              <div
                className="library-icon"
                style={{
                  backgroundImage: `url('${item.thumbnail_url || "/rudrashtakam.jpeg"}')`
                }}
              ></div>
              <div className="library-info">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <div className="library-play">
                <svg viewBox="0 0 16 16">
                  <polygon points="4,2 13,8 4,14" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "var(--text-secondary)", fontStyle: "italic", padding: "2rem" }}>
            Loading resources...
          </div>
        )}
      </div>
    </section>
  );
}
