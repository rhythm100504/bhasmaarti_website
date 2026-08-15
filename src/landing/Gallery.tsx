import React from "react";

export default function Gallery() {
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
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "220px", backgroundImage: "url('/Sacred%20Moments/Mahakaleshwar%20Shikhara%20at%20Dawn.jpg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Mahakaleshwar Shikhara at Dawn</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "160px", backgroundImage: "url('/Sacred%20Moments/Bhasma%20Aarti%20Flames.png')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Bhasma Aarti Flames</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "200px", backgroundImage: "url('/Sacred%20Moments/Temple%20Bells%20at%20Brahma%20Muhurta.webp')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Temple Bells at Brahma Muhurta</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "180px", backgroundImage: "url('/Sacred%20Moments/Full%20Moon%20over%20Ujjain.jpeg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Full Moon over Ujjain</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "240px", backgroundImage: "url('/Sacred%20Moments/Sacred%20Abhishek%20Ritual.jpg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Sacred Abhishek Ritual</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "160px", backgroundImage: "url('/Sacred%20Moments/Floral%20Offerings.jpg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Floral Offerings</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "190px", backgroundImage: "url('/Sacred%20Moments/Trishula%20at%20the%20Main%20Gate.jpg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Trishula at the Main Gate</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "210px", backgroundImage: "url('/Sacred%20Moments/Rudraksha%20%26%20Sacred%20Beads.jpeg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Rudraksha & Sacred Beads</span>
          </div>
        </div>
        <div className="masonry-item">
          <div className="gallery-img" style={{ height: "175px", backgroundImage: "url('/Sacred%20Moments/evening%20glow.jpeg')" }}></div>
          <div className="gallery-overlay">
            <span className="gallery-caption">Evening Aarti Glow</span>
          </div>
        </div>
      </div>
    </section>
  );
}
