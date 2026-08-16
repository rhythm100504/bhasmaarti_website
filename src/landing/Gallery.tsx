import React, { useState, useEffect } from "react";

interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  status: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const heights = ["220px", "160px", "200px", "180px", "240px", "160px", "190px", "210px", "175px"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/gallery");
        const data = await res.json();
        if (data.success && data.items) {
          const published = data.items
            .filter((item: any) => item.status === "Published")
            .slice(0, 9);
          setItems(published);
        }
      } catch (err) {
        console.error("Failed to load gallery items", err);
      }
    };
    fetchItems();
  }, []);

  return (
    <section id="gallery">
      <div className="section-header-flex">
        <div>
          <div className="section-label">Sacred Moments</div>
          <h2 className="section-title">Divine Moments Captured Forever</h2>
          <div className="gold-line"></div>
        </div>
        <a href="/gallery" className="see-all" style={{ marginBottom: "1.5rem" }}>
          See all →
        </a>
      </div>

      <div className="masonry">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div className="masonry-item" key={item.id} onClick={() => window.location.href = "/gallery"} style={{ cursor: "pointer" }}>
              <div 
                className="gallery-img" 
                style={{ 
                  height: heights[index % heights.length], 
                  backgroundImage: `url('${item.image_url || "/Sacred Moments/evening glow.jpeg"}')` 
                }}
              ></div>
              <div className="gallery-overlay">
                <span className="gallery-caption">{item.title}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "var(--text-secondary)", fontStyle: "italic", padding: "2rem" }}>
            Loading moments...
          </div>
        )}
      </div>
    </section>
  );
}
